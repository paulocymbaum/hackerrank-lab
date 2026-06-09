import type { Project } from "../../domain/types/catalog";
import type { Quiz } from "../../domain/types/quiz";
import type { ProjectStatus } from "../../domain/types/quizScore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizSessionStore";

export type LessonActivityKind = "quiz" | "project";

export type LessonActivityItem = {
  id: string;
  kind: LessonActivityKind;
  title: string;
  done: boolean;
  statusLabel: string;
  quizScore?: number;
  projectStatus?: ProjectStatus;
};

export function buildLessonActivityItems(input: {
  courseId: string;
  lessonId: string;
  quizzes: Quiz[];
  projects: Project[];
}): LessonActivityItem[] {
  const quizStore = useQuizProgressStore.getState();
  const projectStore = useProjectProgressStore.getState();
  const items: LessonActivityItem[] = [];

  for (const quiz of input.quizzes) {
    const progress = quizStore.getProgress(input.courseId, quiz.id, input.lessonId);
    const score = progress?.bestScore ?? 0;
    items.push({
      id: quiz.id,
      kind: "quiz",
      title: quiz.title,
      done: score > 0,
      statusLabel: score > 0 ? `Best ${score}%` : "Not started",
      quizScore: score,
    });
  }

  for (const project of input.projects) {
    const status = projectStore.getStatus(input.courseId, project.id, input.lessonId);
    items.push({
      id: project.id,
      kind: "project",
      title: project.title,
      done: status === "done",
      statusLabel:
        status === "done" ? "Done" : status === "doing" ? "In progress" : "Not started",
      projectStatus: status,
    });
  }

  return items;
}

export function computeLessonProgress(items: LessonActivityItem[]): { done: number; total: number } {
  const done = items.filter((item) => item.done).length;
  return { done, total: items.length };
}
