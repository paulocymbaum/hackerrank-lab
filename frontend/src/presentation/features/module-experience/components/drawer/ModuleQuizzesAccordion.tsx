import clsx from "clsx";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { Quiz } from "../../../../../domain/types/quiz";
import { computeProgressPercent } from "../../../../../domain/scoreProgress";
import { quizProgressKey } from "../../../../../domain/types/quiz";
import { useTranslation } from "../../../../../application/hooks/useTranslation";
import { Icon } from "../../../../design-system";
import { ModuleNavRow } from "./ModuleNavRow";

export function ModuleQuizzesAccordion(props: {
  courseId: string;
  quizzes: Quiz[];
  quizByKey: Record<string, { lastAttempt?: { score: number; total: number } }>;
  activeQuizId: string | null;
  onOpenQuiz: (quizId: string) => void;
}) {
  const { t } = useTranslation();

  if (props.quizzes.length === 0) return null;

  return (
    <details className="group mt-2 border-t border-border0 pt-2" open>
      <summary
        className={clsx(
          "flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-panel px-2 py-2",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
        )}
      >
        <Icon icon={HelpCircle} size={14} className="shrink-0 text-text1" />
        <span className="min-w-0 flex-1 text-meta font-semibold text-text0">
          {t("module.moduleQuizzes")}
        </span>
        <Icon icon={ChevronDown} size={14} className="shrink-0 text-text1 transition group-open:rotate-180" />
      </summary>
      <div className="grid gap-0.5 py-1 pl-2">
        {props.quizzes.map((quiz) => {
          const lastAttempt = props.quizByKey[quizProgressKey(props.courseId, quiz.id, quiz.lessonId)]
            ?.lastAttempt;
          const lastSubmissionPercent = lastAttempt
            ? computeProgressPercent(lastAttempt.score, lastAttempt.total)
            : undefined;

          return (
            <ModuleNavRow
              key={quiz.id}
              icon={HelpCircle}
              label={t("quiz.title")}
              sublabel={quiz.title}
              active={props.activeQuizId === quiz.id}
              lastSubmissionPercent={lastSubmissionPercent}
              onClick={() => props.onOpenQuiz(quiz.id)}
            />
          );
        })}
      </div>
    </details>
  );
}
