import clsx from "clsx";
import { computeProgressPercent } from "../../../../domain/scoreProgress";

export type ProgressBarSize = "xs" | "sm" | "md";

export function ProgressBar(props: {
  value: number;
  max: number;
  size?: ProgressBarSize;
  className?: string;
  "aria-label"?: string;
}) {
  const percent = computeProgressPercent(props.value, props.max);
  const size = props.size ?? "sm";

  return (
    <div
      className={clsx(
        "overflow-hidden rounded-pill border border-border0 bg-surfacePanel",
        size === "xs" && "h-1",
        size === "sm" && "h-1.5",
        size === "md" && "h-2",
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
}
