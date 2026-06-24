import clsx from "clsx";
import type { Quiz, QuizProgress } from "../../domain/types/quiz";
import { useActivityScoreLabels } from "../../application/hooks/useLocalizedLabels";
import { ProgressBar } from "../design-system";
import { quizProgressMetrics } from "./score/activityScoreLabels";

export function QuizSidebarItem(props: {
  quiz: Quiz;
  progress: QuizProgress | null;
  active?: boolean;
  onClick: () => void;
}) {
  const { formatQuizScoreLabel } = useActivityScoreLabels();
  const { value, max } = quizProgressMetrics(props.quiz, props.progress);
  const scoreLabel = formatQuizScoreLabel(props.quiz, props.progress);

  return (
    <button
      type="button"
      className={clsx(
        "flex w-full flex-col gap-2 rounded-panel border px-3 py-2.5 text-left transition",
        props.active
          ? "border-transparent bg-accentFill text-textOnAccent"
          : "border-border0 bg-surfaceControl text-text0 hover:brightness-[1.03]",
      )}
      onClick={props.onClick}
    >
      <span className="truncate text-body font-medium">{props.quiz.title}</span>
      <ProgressBar
        value={value}
        max={max}
        size="sm"
        aria-label={`${value} of ${max} quiz points`}
      />
      <span
        className={clsx(
          "truncate text-meta",
          props.active ? "text-textOnAccent/80" : "text-text1",
        )}
      >
        {scoreLabel}
      </span>
    </button>
  );
}
