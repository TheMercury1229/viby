import React from "react";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  return <div>ProjectPage-ProjectId: {projectId}</div>;
}
