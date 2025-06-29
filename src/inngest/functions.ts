import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils";
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
      system:
        "You are an expert next.js developer.You write readable ,maintainable and efficient code.You write simple next.js & react  snippets",
      model: gemini({
        model: "gemini-2.0-flash-lite",
        apiKey: process.env.GEMINI_API_KEY,
      }),
    });
    const { output } = await codeAgent.run(
      "Write an snippet for: " + event.data.value
    );

    const sandbox = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandBoxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    return { summary: output, sandboxUrl: sandbox };
  }
);
