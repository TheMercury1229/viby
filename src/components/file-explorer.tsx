import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useCallback, Fragment, useMemo } from "react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { CodeView } from "@/components/code-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  convertFilesToTreeItems,
  getLanguageFromFileExtension,
} from "@/lib/utils";
import { TreeView } from "./tree-view";
type FileCollection = { [path: string]: string };

interface FileBreadcrumbProps {
  filePath: string;
}
const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
  const path = filePath.split("/");
  const maxSegments = 3;
  const renderBreadcrumbItems = () => {
    if (path.length <= maxSegments) {
      return path.map((segment, index) => {
        const isLast = index === path.length - 1;
        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">
                  {segment}
                </BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = path[0];
      const lastSegment = path[path.length - 1];
      return (
        <Fragment>
          <BreadcrumbItem>
            <span className="text-muted-foreground">{firstSegment}</span>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="font-medium">
              {lastSegment}
            </BreadcrumbItem>
          </BreadcrumbItem>
        </Fragment>
      );
    }
  };
  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
};
interface FileExplorerProps {
  files: FileCollection;
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });
  const [copied, setCopied] = useState(false);
  const treeData = useMemo(() => {
    console.log(convertFilesToTreeItems(files));
    return convertFilesToTreeItems(files);
  }, [files]);
  const handleFileSelect = useCallback((filePath: string) => {
    setSelectedFile(filePath);
  }, []);
  const handleCopy = () => {
    if (selectedFile === null) return;
    navigator.clipboard.writeText(files[selectedFile] || "");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle
        className="hover:bg-primary transition-colors"
        withHandle
      />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              <FileBreadcrumb filePath={selectedFile} />
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant={"outline"}
                  size="icon"
                  className="ml-auto"
                  onClick={handleCopy}
                  disabled={false}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromFileExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view it&apos;s content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
