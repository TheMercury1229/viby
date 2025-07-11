import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { use, useEffect, useRef } from "react";
import { MessageCard } from "@/modules/projects/ui/components/message-card";
import { MessageForm } from "@/modules/projects/ui/components/message-form";
import { Fragment } from "@/generated/prisma";
import { MessageLoading } from "./message-loading";
interface MessageContainerProps {
  projectId: string;
  activeFragement: Fragment | null;
  setActiveFragement: (fragment: Fragment | null) => void;
}
export const MessageContainer = ({
  projectId,
  activeFragement,
  setActiveFragement,
}: MessageContainerProps) => {
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      {
        projectId,
      },
      {
        // Temporary live messages  loading
        refetchInterval: 5000,
      }
    )
  );
  // Set the active fragment to the last assistant message's fragment
  // Todo:This logic is commented because live messages are not yet implemented
  // useEffect(() => {
  //   const lastAssistantMessageWithFragment = messages.findLast(
  //     (message) => message.role === "ASSISTANT" && !!message.Fragment
  //   );
  //   if (lastAssistantMessageWithFragment?.Fragment) {
  //     setActiveFragement(lastAssistantMessageWithFragment.Fragment);
  //   }
  // }, [messages, setActiveFragement]);
  // Scroll to the bottom when messages change
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pr-1 pt-2">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragement={message.Fragment}
              createdAt={message.createdAt}
              isActiveFragement={message.Fragment?.id === activeFragement?.id}
              onFragementClick={() => setActiveFragement(message.Fragment)}
              type={message.type}
            />
          ))}
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointers-event-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
