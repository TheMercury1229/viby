"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
export default function Home() {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}));
  return (
    <div>
      Hello
      <Button
        className="bg-red-500"
        onClick={() => invoke.mutate({ text: "john@gmail.com" })}
      >
        Run Invoke function
      </Button>
    </div>
  );
}
