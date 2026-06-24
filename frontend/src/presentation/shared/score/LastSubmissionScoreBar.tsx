import clsx from "clsx";
import { submissionScoreTier } from "../../../domain/scoreProgress";

const TIER_FILL: Record<ReturnType<typeof submissionScoreTier>, string> = {
  success: "bg-success0",
  warning: "bg-amber-400",
  danger: "bg-danger0",
};

export function LastSubmissionScoreBar(props: {
  percent: number;
  className?: string;
}) {
  const percent = Math.min(100, Math.max(0, Math.round(props.percent)));
  const tier = submissionScoreTier(percent);

  return (
    <div
      className={clsx("grid gap-1", props.className)}
      onClick={(event) => event.stopPropagation()}
    >
      <p className="m-0 text-meta text-text2">Score of the last submission</p>
      <div className="flex items-center gap-2">
        <div
          className="h-1 min-w-0 flex-1 overflow-hidden rounded-pill border border-border0 bg-surfacePanel"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Score of the last submission: ${percent}%`}
        >
          <div
            className={clsx(
              "h-full rounded-pill transition-[width] motion-reduce:transition-none",
              TIER_FILL[tier],
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="shrink-0 text-meta font-medium text-text1">{percent}%</span>
      </div>
    </div>
  );
}
