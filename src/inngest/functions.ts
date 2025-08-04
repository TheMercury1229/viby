import { inngest } from "./client";
import {
  gemini,
  createAgent,
  createTool,
  createNetwork,
  type Tool,
  Message,
  createState,
} from "@inngest/agent-kit";
import { z } from "zod";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandBoxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("hardy-nextjs");
      await sandbox.setTimeout(30000 * 10 * 3);
      return sandbox.sandboxId;
    });
    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessage: Message[] = [];
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 7,
        });
        for (const message of messages) {
          formattedMessage.push({
            type: "text",
            role: message.role === "USER" ? "user" : "assistant",
            content: message.content,
          });
        }
        return formattedMessage.reverse();
      }
    );
    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description:
        "A code agent that can write code in a Next.js 15.3.3 environment",
      system: PROMPT,
      model: gemini({
        model: "gemini-2.0-flash-lite",
        apiKey: process.env.GEMINI_API_KEY,
      }),
      // model: openai({
      //   model: "gpt-4o",
      //   apiKey: process.env.OPENAI_API_KEY,
      //   defaultParameters: {
      //     temperature: 0.2,
      //   },
      // }),
      tools: [
        createTool({
          name: "terminal",
          description: "Run the commands in the terminal",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandBoxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (error) {
                console.error(
                  "Command Failed:",
                  error,
                  "\nstdout:",
                  buffers.stdout,
                  "\nstderr:",
                  buffers.stderr
                );
                return `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update a file in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFile = await step?.run(
              "create-or-update-file",
              async () => {
                try {
                  const updatedFiles = network.state.data?.files || {};
                  const sandbox = await getSandbox(sandBoxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (error) {
                  return "Error creating or updating files: " + error;
                }
              }
            );
            if (typeof newFile === "object") {
              network.state.data.files = newFile;
            }
            return "Files created or updated successfully.";
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read a file from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("read-file", async () => {
              try {
                const sandbox = await getSandbox(sandBoxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return "Error:" + error;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessage = await lastAssistantTextMessageContent(
            result
          );
          if (lastAssistantMessage && network) {
            if (lastAssistantMessage.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessage;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });
    const result = await network.run(event.data.value, { state });
    const fragementTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "Generates a title for the code fragment",
      system: FRAGMENT_TITLE_PROMPT,
      model: gemini({
        model: "gemini-1.5-flash",
      }),
    });
    const responseGenerator = createAgent({
      name: "response-generator",
      description: "Generates a response based on the task summary",
      system: RESPONSE_PROMPT,
      model: gemini({
        model: "gemini-1.5-flash",
      }),
    });
    const { output: fragmentTitle } = await fragementTitleGenerator.run(
      result.state.data.summary
    );
    const { output: response } = await responseGenerator.run(
      result.state.data.summary
    );
    const generateFragmentTitle = () => {
      if (fragmentTitle[0].type !== "text") {
        return "Fragment";
      }
      if (Array.isArray(fragmentTitle[0].content)) {
        return fragmentTitle[0].content.map((item) => item).join("");
      } else {
        return fragmentTitle[0].content;
      }
    };
    const generateResponse = () => {
      if (response[0].type !== "text") {
        return "Fragment";
      }
      if (Array.isArray(response[0].content)) {
        return response[0].content.map((item) => item).join("");
      } else {
        return response[0].content;
      }
    };
    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;
    const sandbox = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandBoxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    // Save the messages to the database
    await step.run("save-result", async () => {
      if (isError) {
        await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
        return;
      }
      await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: generateResponse() || result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          Fragment: {
            create: {
              sandboxUrl: sandbox,
              title: generateFragmentTitle() || "Fragment",
              files: result.state.data.files || {},
            },
          },
        },
      });
    });

    return {
      sandboxUrl: sandbox,
      title: "Fragement",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
