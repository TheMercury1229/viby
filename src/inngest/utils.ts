import Sandbox from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandBoxId: string) {
  const sandbox = await Sandbox.connect(sandBoxId);
  await sandbox.setTimeout(30000 * 10 * 3);

  return sandbox;
}

export async function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantMessage = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );
  const msg = result.output[lastAssistantMessage] as TextMessage | undefined;
  return msg?.content
    ? typeof msg.content === "string"
      ? msg.content
      : msg.content.map((m) => m.text).join("")
    : undefined;
}
