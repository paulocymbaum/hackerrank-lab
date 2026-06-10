import type { Quiz } from "../../domain/types/quiz";
import type { Course } from "../../domain/types/catalog";
import { getModuleById } from "./catalogSelectors";

export type QuizLookupScope = {
  lessonId?: string;
  moduleId?: string;
};

export function quizSessionKey(quizId: string, lessonId?: string): string {
  return lessonId ? `${lessonId}:${quizId}` : quizId;
}

export function findQuizInList(quizzes: Quiz[], quizId: string): Quiz | null {
  return quizzes.find((q) => q.id === quizId) ?? null;
}

export function getQuizById(
  course: Course,
  quizId: string,
  scope?: QuizLookupScope,
): Quiz | null {
  if (scope?.moduleId && scope.lessonId) {
    const mod = getModuleById(course, scope.moduleId);
    const inLesson = mod?.quizzes.find(
      (q) => q.id === quizId && q.lessonId === scope.lessonId,
    );
    if (inLesson) return inLesson;
  }

  if (scope?.lessonId) {
    for (const mod of course.modules ?? []) {
      const inLesson = mod.quizzes.find(
        (q) => q.id === quizId && q.lessonId === scope.lessonId,
      );
      if (inLesson) return inLesson;
    }
    const flat = course.quizzes.find(
      (q) => q.id === quizId && q.lessonId === scope.lessonId,
    );
    if (flat) return flat;
  }

  if (scope?.moduleId) {
    const mod = getModuleById(course, scope.moduleId);
    const inModule = mod?.quizzes.find((q) => q.id === quizId && !q.lessonId);
    if (inModule) return inModule;
  }

  return course.quizzes.find((q) => q.id === quizId) ?? null;
}
