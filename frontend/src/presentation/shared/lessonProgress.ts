import type { Lesson, Project } from "../../domain/types/catalog";
import type { Quiz } from "../../domain/types/quiz";

export function countLessonProgress(input: {
  courseId: string;
  lessonId: string;
  quizzes: Quiz[];
  projects: Project[];
  getQuizProgress: (courseId: string, quizId: string, lessonId?: string) => {
    bestScore?: number;
  } | null;
  getProjectStatus: (
    courseId: string,
    projectId: string,
    lessonId?: string,
  ) => "pending" | "doing" | "done";
}): { done: number; total: number } {
  const items: boolean[] = [];
  for (const quiz of input.quizzes) {
    const progress = input.getQuizProgress(input.courseId, quiz.id, input.lessonId);
    items.push((progress?.bestScore ?? 0) > 0);
  }
  for (const project of input.projects) {
    items.push(input.getProjectStatus(input.courseId, project.id, input.lessonId) === "done");
  }
  return { done: items.filter(Boolean).length, total: items.length };
}

export type LessonNavItem = {
  lesson: Lesson;
  quizzes: Quiz[];
  projects: Project[];
};
