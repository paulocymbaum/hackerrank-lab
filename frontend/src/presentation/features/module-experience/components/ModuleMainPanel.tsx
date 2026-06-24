import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ModulePanelHeader } from "./ModulePanelHeader";

/** Shared chrome for the module main column — aligns with `ModuleContentsDrawer` header. */
export function ModuleMainPanel(props: {
  indexLabel: string;
  meta: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <ModulePanelHeader
        meta={props.meta}
        indexLabel={props.indexLabel}
        title={props.title}
        subtitle={props.subtitle}
        icon={props.icon}
        active
      />
      <div className="min-h-0 flex-1 overflow-auto p-3">{props.children}</div>
    </main>
  );
}
