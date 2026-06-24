import { computeProgressPercent } from "../../domain/scoreProgress";
import type { Project } from "../../domain/types/catalog";
import type { Quiz } from "../../domain/types/quiz";
import type { ProjectStatus } from "../../domain/types/quizScore";
import { useProjectDeliveryStore } from "../stores/projectDeliveryStore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

export type LessonActivityKind = "quiz" | "project";

export type LessonActivityItem = {
  id: string;
  kind: LessonActivityKind;
  title: string;
  done: boolean;
  statusLabel: string;
  quizScore?: number;
  projectStatus?: ProjectStatus;
  /** 0–100 from the latest quiz attempt or project delivery review. */
  lastSubmissionPercent?: number;
};

export function buildLessonActivityItems(input: {
  courseId: string;
  lessonId: string;
  quizzes: Quiz[];
  projects: Project[];
}): LessonActivityItem[] {
  const quizStore = useQuizProgressStore.getState();
  const projectStore = useProjectProgressStore.getState();
  const deliveryStore = useProjectDeliveryStore.getState();
  const items: LessonActivityItem[] = [];

  for (const quiz of input.quizzes) {
    const progress = quizStore.getProgress(input.courseId, quiz.id, input.lessonId);
    const score = progress?.bestScore ?? 0;
    const total = progress?.bestTotal ?? quiz.questions.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const lastAttempt = progress?.lastAttempt;
    const lastSubmissionPercent = lastAttempt
      ? computeProgressPercent(lastAttempt.score, lastAttempt.total)
      : undefined;
    items.push({
      id: quiz.id,
      kind: "quiz",
      title: quiz.title,
      done: score > 0,
      statusLabel: score > 0 ? `Best ${pct}%` : "Not started",
      quizScore: pct,
      lastSubmissionPercent,
    });
  }

  for (const project of input.projects) {
    const status = projectStore.getStatus(input.courseId, project.id, input.lessonId);
    const deliveries = deliveryStore.getDeliveries(
      input.courseId,
      project.id,
      input.lessonId,
    );
    const lastReview = deliveries[deliveries.length - 1]?.review;
    items.push({
      id: project.id,
      kind: "project",
      title: project.title,
      done: status === "done",
      statusLabel:
        status === "done" ? "Done" : status === "doing" ? "In progress" : "Not started",
      projectStatus: status,
      lastSubmissionPercent: lastReview?.score,
    });
  }

  return items;
}

export function computeLessonProgress(items: LessonActivityItem[]): { done: number; total: number } {
  const done = items.filter((item) => item.done).length;
  return { done, total: items.length };
}
