import { useMemo } from "react";
import type { Quiz, QuizProgress } from "../../domain/types/quiz";
import type { ProjectStatus } from "../../domain/types/quizScore";
import { PROJECT_POINTS_WEIGHT } from "../../domain/types/quizScore";
import { useTranslation } from "../hooks/useTranslation";

export function useActivityScoreLabels() {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      formatQuizScoreLabel(quiz: Quiz, progress: QuizProgress | null): string {
        if (progress) {
          const attempts =
            progress.attempts > 1
              ? t("quiz.attemptsSuffix", { count: progress.attempts })
              : "";
          return t("quiz.bestScore", {
            score: progress.bestScore,
            total: progress.bestTotal,
            attempts,
          });
        }
        return t("quiz.upToPoints", { points: quiz.questions.length });
      },
      formatProjectScoreLabel(status: ProjectStatus, points = 0): string {
        if (status === "done") return t("project.donePoints", { points });
        if (status === "doing") return t("project.inProgress");
        return t("project.pointsMax", { max: PROJECT_POINTS_WEIGHT });
      },
    }),
    [t],
  );
}

export function useLessonProgressLabel() {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      formatLessonProgressLabel(done: number, total: number): string | undefined {
        if (total === 0) return t("lesson.readingOnly");
        return t("lesson.activitiesComplete", { done, total });
      },
    }),
    [t],
  );
}

export function useCourseTabLabels() {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      readme: t("tabs.readme"),
      examples: t("tabs.examples"),
      projects: t("tabs.projects"),
      quiz: t("tabs.quiz"),
    }),
    [t],
  );
}

export function useProjectStatusLabels() {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      pending: t("project.pending"),
      doing: t("project.doing"),
      done: t("project.done"),
    }),
    [t],
  );
}
