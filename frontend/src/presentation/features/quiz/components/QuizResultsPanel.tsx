import clsx from "clsx";
import { Trophy, RotateCcw } from "lucide-react";
import type { QuizAttempt } from "../../../../domain/types/quiz";
import type { CoursePointsWithMax } from "../../../../domain/types/quizScore";
import { Card, Button, Icon } from "../../../design-system";

function scoreTier(pct: number): "success" | "neutral" | "danger" {
  if (pct >= 80) return "success";
  if (pct >= 50) return "neutral";
  return "danger";
}

export function QuizResultsPanel(props: {
  attempt: QuizAttempt;
  quizTitle: string;
  coursePoints: CoursePointsWithMax;
  quizPointsDelta: number;
  onRetry: () => void;
  onBackToList: () => void;
}) {
  const pct =
    props.attempt.total > 0
      ? Math.round((props.attempt.score / props.attempt.total) * 100)
      : 0;
  const tier = scoreTier(pct);

  return (
    <Card variant="panel" className="grid gap-4 p-4">
      <div
        className={clsx(
          "rounded-panel border p-4",
          tier === "success" && "border-successBorder bg-successFill",
          tier === "neutral" && "border-border0 bg-surfacePanel",
          tier === "danger" && "border-dangerBorder bg-dangerFill",
        )}
      >
        <div className="flex items-start gap-3">
          <Icon
            icon={Trophy}
            size={22}
            className={clsx(
              "mt-0.5 shrink-0",
              tier === "success" && "text-successIcon",
              tier === "neutral" && "text-accent0",
              tier === "danger" && "text-dangerIcon",
            )}
          />
          <div className="min-w-0">
            <p
              className={clsx(
                "m-0 text-body-lg font-semibold",
                tier === "success" && "text-successText",
                tier === "neutral" && "text-text0",
                tier === "danger" && "text-dangerText",
              )}
            >
              {props.attempt.score} / {props.attempt.total} correct ({pct}%)
            </p>
            <p className="m-0 mt-2 text-body text-text1">
              You finished &ldquo;{props.quizTitle}&rdquo;. Review explanations and try again to
              improve your score.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-meta text-text1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Course score</span>
            <span className="font-semibold text-text0">
              {props.coursePoints.totalPoints}
              {props.coursePoints.totalMax > 0 ? ` / ${props.coursePoints.totalMax}` : ""} pts
            </span>
          </div>
          {props.quizPointsDelta > 0 ? (
            <p className="m-0 mt-1 text-successText">
              +{props.quizPointsDelta} quiz pts added to your course total
            </p>
          ) : (
            <p className="m-0 mt-1">
              Your quiz total did not change — beat your previous best to earn more points.
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" size="md" onClick={props.onRetry}>
            <Icon icon={RotateCcw} />
            Try again
          </Button>
          <Button variant="secondary" size="md" onClick={props.onBackToList}>
            Back to quizzes
          </Button>
        </div>
      </div>
    </Card>
  );
}
