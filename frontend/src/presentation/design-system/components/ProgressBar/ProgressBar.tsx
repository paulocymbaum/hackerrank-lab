import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { computeProgressPercent } from "../../../../domain/scoreProgress";
import { Icon } from "../../icons/Icon";
import { Popover } from "../Popover";

export type ProgressBarSize = "xs" | "sm" | "md";

export type ProgressBarPopoverContent =
  | ReactNode
  | ((helpers: { close: () => void }) => ReactNode);

export function ProgressBar(props: {
  value: number;
  max: number;
  size?: ProgressBarSize;
  className?: string;
  "aria-label"?: string;
  popoverContent?: ProgressBarPopoverContent;
  popoverLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const percent = computeProgressPercent(props.value, props.max);
  const size = props.size ?? "sm";
  const hasPopover = Boolean(props.popoverContent);
  const close = () => setOpen(false);

  const bar = (
    <div
      className={clsx(
        "overflow-hidden rounded-pill border border-border0 bg-surfacePanel",
        size === "xs" && "h-1",
        size === "sm" && "h-1.5",
        size === "md" && "h-2",
        hasPopover && "pointer-events-none",
        props.className,
      )}
      role="progressbar"
      aria-valuenow={props.value}
      aria-valuemin={0}
      aria-valuemax={props.max}
      aria-label={props["aria-label"]}
    >
      <div
        className="h-full rounded-pill bg-accentFill transition-[width] motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  );

  if (!hasPopover) return bar;

  const panelContent =
    typeof props.popoverContent === "function"
      ? props.popoverContent({ close })
      : props.popoverContent;

  return (
    <Popover
      className="w-full"
      panelClassName="w-[min(100vw-2rem,24rem)] p-0"
      open={open}
      onOpenChange={setOpen}
      trigger={({ open: isOpen, toggle, triggerId, panelId }) => (
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={props.popoverLabel ?? props["aria-label"] ?? "Show activity progress"}
          onClick={toggle}
          className={clsx(
            "flex w-full items-center gap-2 rounded-panel border border-transparent px-1 py-1 text-left transition",
            "hover:border-border0 hover:bg-surfacePanel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
          )}
        >
          <span className="min-w-0 flex-1">{bar}</span>
          <Icon
            icon={ChevronDown}
            size={16}
            className={clsx("shrink-0 text-text1 transition", isOpen && "rotate-180")}
          />
        </button>
      )}
    >
      {panelContent}
    </Popover>
  );
}
