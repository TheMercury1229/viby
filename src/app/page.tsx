"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [value, setValue] = useState<string>("");
  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message created successfully!");
      },
    })
  );
  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        disabled={!value || createMessage.isPending}
        className="bg-red-500"
        onClick={() => createMessage.mutate({ value })}
      >
        Run Invoke function
      </Button>
      {messages?.length ? (
        <ul className="mt-4">
          {messages.map((message) => (
            <li key={message.id} className="mb-2">
              <span className="font-bold">{message.role}:</span>{" "}
              {message.content}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
