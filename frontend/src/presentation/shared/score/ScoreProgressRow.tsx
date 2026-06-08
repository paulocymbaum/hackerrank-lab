import clsx from "clsx";
import type { ScoreMetric } from "../../../domain/scoreProgress";
import { computeProgressPercent, formatScoreLabel } from "../../../domain/scoreProgress";
import { ProgressBar, type ProgressBarSize } from "../../design-system/components/ProgressBar";

export function ScoreProgressRow(props: {
  label?: string;
  metric: ScoreMetric;
  size?: ProgressBarSize;
  showPercent?: boolean;
  className?: string;
}) {
  if (props.metric.max <= 0) return null;

  const percent = computeProgressPercent(props.metric.value, props.metric.max);

  return (
    <div className={clsx("grid gap-1.5", props.className)}>
      <div className="flex items-center justify-between gap-3 text-meta text-text1">
        {props.label ? <span>{props.label}</span> : <span />}
        <span className="shrink-0 font-medium text-text0">
          {formatScoreLabel(props.metric.value, props.metric.max)}
          {props.showPercent ? ` · ${percent}%` : ""}
        </span>
      </div>
      <ProgressBar
        value={props.metric.value}
        max={props.metric.max}
        size={props.size}
        aria-label={props.label ? `${props.label}: ${percent}%` : `${percent}%`}
      />
    </div>
  );
}
