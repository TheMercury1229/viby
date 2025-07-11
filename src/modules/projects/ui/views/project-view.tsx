"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Fragment } from "@/generated/prisma";
import { MessageContainer } from "@/modules/projects/ui/components/message-container";
import { Suspense, useState } from "react";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
interface ProjectViewProps {
  projectId: string;
}
export const ProjectView = ({ projectId }: ProjectViewProps) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>Loading Project Header...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<div>Loading messages...</div>}>
            <MessageContainer
              activeFragement={activeFragment}
              setActiveFragement={setActiveFragment}
              projectId={projectId}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          {!!activeFragment && <FragmentWeb data={activeFragment} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
