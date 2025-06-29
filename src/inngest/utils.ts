import Sandbox from "@e2b/code-interpreter";

export async function getSandbox(sandBoxId: string) {
  const sandbox = await Sandbox.connect(sandBoxId);

  return sandbox;
}
