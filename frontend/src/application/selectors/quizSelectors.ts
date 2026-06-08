import type { Quiz } from "../../domain/types/quiz";
import type { Course } from "../../domain/types/catalog";

export function getQuizById(course: Course, quizId: string): Quiz | null {
  return course.quizzes.find((q) => q.id === quizId) ?? null;
}
