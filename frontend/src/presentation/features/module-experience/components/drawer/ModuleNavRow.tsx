import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { Icon } from "../../../../design-system";
import { LastSubmissionScoreBar } from "../../../../shared/score";

export function ModuleNavRow(props: {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  active?: boolean;
  done?: boolean;
  lastSubmissionPercent?: number;
  onClick: () => void;
}) {
  return (
    <div className="grid gap-1.5">
      <button
        type="button"
        onClick={props.onClick}
        className={clsx(
          "flex w-full items-center gap-2 rounded-panel px-2 py-1.5 text-left transition",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
          props.active ? "border border-accent0/40 bg-surfaceAccent" : "border border-transparent",
        )}
      >
        <span
          className={clsx(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-panel border",
            props.done
              ? "border-successBorder bg-successFill text-successIcon"
              : "border-border0 bg-surfaceControl text-text1",
          )}
        >
          <Icon icon={props.icon} size={14} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-meta font-medium text-text0">{props.label}</span>
          <span className="block truncate text-meta text-text2">{props.sublabel}</span>
        </span>
      </button>
      {props.lastSubmissionPercent !== undefined ? (
        <LastSubmissionScoreBar
          percent={props.lastSubmissionPercent}
          className="px-2 pb-1.5 pl-11"
        />
      ) : null}
    </div>
  );
}
