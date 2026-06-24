import type { Quiz } from "../../domain/types/quiz";
import type { Course } from "../../domain/types/catalog";

export function getQuizById(course: Course, quizId: string): Quiz | null {
  const fromCourse = course.quizzes.find((q) => q.id === quizId);
  if (fromCourse) return fromCourse;

  for (const mod of course.modules ?? []) {
    const fromModule = mod.quizzes.find((q) => q.id === quizId);
    if (fromModule) return fromModule;
  }

  return null;
}
