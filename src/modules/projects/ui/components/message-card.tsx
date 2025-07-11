import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Image from "next/image";
interface UserMessageCardProps {
  content: string;
}
const UserMessageCard = ({ content }: UserMessageCardProps) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words">
        {content}
      </Card>
    </div>
  );
};

interface FragementCardProps {
  fragment: Fragment;
  isActive: boolean;
  onFragementClick: (fragement: Fragment) => void;
}
const FragementCard = ({
  fragment,
  isActive,
  onFragementClick,
}: FragementCardProps) => {
  return (
    <button
      className={cn(
        "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",
        isActive &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary"
      )}
      onClick={() => onFragementClick(fragment)}
    >
      <Code2Icon className="size-4 mt-0.5" />
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {fragment.title}
        </span>
        <span className="text-sm ">Preview</span>
      </div>
      <div className="flex items-center justify-center mt-0.5">
        <ChevronRightIcon className="size-4" />
      </div>
    </button>
  );
};

interface AssistantMessageCardProps {
  content: string;
  fragement: Fragment | null;
  createdAt: Date;
  isActiveFragement: boolean;
  onFragementClick: (fragment: Fragment) => void;
  type: MessageType;
}
const AssistantMessageCard = ({
  content,
  fragement,
  createdAt,
  isActiveFragement,
  onFragementClick,
  type,
}: AssistantMessageCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4",
        type == "ERROR" && "text-red-700 dark:text-red-500"
      )}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="Viby Logo"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Viby</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <span>{content}</span>
        {fragement && type === "RESULT" && (
          <FragementCard
            fragment={fragement}
            isActive={isActiveFragement}
            onFragementClick={onFragementClick}
          />
        )}
      </div>
    </div>
  );
};
interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragement: Fragment | null;
  createdAt: Date;
  isActiveFragement: boolean;
  onFragementClick: (fragment: Fragment) => void;
  type: MessageType;
}
export const MessageCard = ({
  content,
  role,
  fragement,
  createdAt,
  isActiveFragement,
  onFragementClick,
  type,
}: MessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessageCard
        content={content}
        fragement={fragement}
        createdAt={createdAt}
        isActiveFragement={isActiveFragement}
        onFragementClick={onFragementClick}
        type={type}
      />
    );
  }
  return <UserMessageCard content={content} />;
};
