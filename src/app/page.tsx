"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [value, setValue] = useState<string>("");
  const router = useRouter();
  const trpc = useTRPC();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        toast.success(`Project created with ID: ${data.id}`);
        router.push(`/projects/${data.id}`);
      },
    })
  );
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto flex items-center flex-col gap-y-4  justify-center">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button
          disabled={!value || createProject.isPending}
          className="bg-red-500"
          onClick={() => createProject.mutate({ value })}
        >
          Run Invoke function
        </Button>
      </div>
    </div>
  );
}
