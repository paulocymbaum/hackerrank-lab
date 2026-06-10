import type { ReactNode } from "react";
import { Layers } from "lucide-react";
import { Icon } from "../../../design-system";

export function LessonSection(props: {
  sectionKey: string;
  sectionLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <header className="flex items-center gap-2 border-b border-border0 pb-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-panel border border-border0 bg-surfaceControl text-text1"
          aria-hidden
        >
          <Icon icon={Layers} size={16} />
        </span>
        <div className="min-w-0">
          <h2 className="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-mono text-meta font-semibold text-accent0">{props.sectionKey}</span>
            <span className="text-body font-semibold text-text0">{props.sectionLabel}</span>
          </h2>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{props.children}</div>
    </section>
  );
}
