import { inngest } from "./client";
import {
  gemini,
  createAgent,
  createTool,
  createNetwork,
} from "@inngest/agent-kit";
import { z } from "zod";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { PROMPT } from "@/prompt";
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandBoxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("hardy-nextjs");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      description:
        "A code agent that can write code in a Next.js 15.3.3 environment",
      system: PROMPT,
      model: gemini({
        model: "gemini-2.0-flash-lite",
        apiKey: process.env.GEMINI_API_KEY,
      }),
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
          handler: async ({ files }, { step, network }) => {
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

    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data?.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });
    const result = await network.run(event.data.value);

    const sandbox = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandBoxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    return {
      sandboxUrl: sandbox,
      title: "Fragement",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
