import clsx from "clsx";

export function QuizProgressBar(props: {
  current: number;
  total: number;
  className?: string;
}) {
  const pct = props.total > 0 ? Math.round(((props.current + 1) / props.total) * 100) : 0;

  return (
    <div className={clsx("grid gap-2", props.className)}>
      <div className="flex items-center justify-between gap-3 text-meta text-text1">
        <span>
          Question {Math.min(props.current + 1, props.total)} of {props.total}
        </span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-pill border border-border0 bg-surfacePanel"
        role="progressbar"
        aria-valuenow={props.current + 1}
        aria-valuemin={1}
        aria-valuemax={props.total}
      >
        <div
          className="h-full rounded-pill bg-accent0 transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
