import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Icon } from "../../../design-system";

const INDEX_COL = "w-12 shrink-0 font-mono text-meta font-semibold text-accent0";

export function ModulePanelHeader(props: {
  meta: string;
  indexLabel: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  trailing?: ReactNode;
}) {
  const row = (
    <div className="mt-1 flex min-w-0 items-center gap-2">
      <span className={INDEX_COL}>{props.indexLabel}</span>
      {props.icon ? (
        <span
          className={clsx(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-panel border",
            props.active
              ? "border-accent0/40 bg-surfaceAccent text-accent0"
              : "border-border0 bg-surfaceControl text-text1",
          )}
        >
          <Icon icon={props.icon} size={14} />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body font-semibold text-text0">{props.title}</span>
        {props.subtitle ? (
          <span className="block truncate text-meta text-text1">{props.subtitle}</span>
        ) : null}
      </span>
      {props.trailing}
    </div>
  );

  return (
    <header
      className={clsx(
        "shrink-0 border-b border-border0 px-3 py-3",
        props.active && "bg-surfaceAccent/40",
      )}
    >
      <p className="m-0 text-meta font-semibold uppercase tracking-wide text-text1">{props.meta}</p>
      {props.onClick ? (
        <button
          type="button"
          onClick={props.onClick}
          className={clsx(
            "mt-1 w-full rounded-panel text-left transition",
            "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
            props.active && "bg-surfaceAccent",
          )}
        >
          {row}
        </button>
      ) : (
        row
      )}
    </header>
  );
}
