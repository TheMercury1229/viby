"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState<string>("");
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}));
  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button className="bg-red-500" onClick={() => invoke.mutate({ value })}>
        Run Invoke function
      </Button>
    </div>
  );
}
