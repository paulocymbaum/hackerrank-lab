import clsx from "clsx";
import { ProgressBar } from "../../../design-system";

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
      <ProgressBar
        value={props.current + 1}
        max={props.total}
        size="md"
        aria-label={`Question ${Math.min(props.current + 1, props.total)} of ${props.total}`}
      />
    </div>
  );
}
