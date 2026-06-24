import type { ReactNode } from "react";

export function ArtifactSection(props: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="px-1 text-meta font-semibold text-text1">{props.title}</div>
      {props.children}
    </div>
  );
}
