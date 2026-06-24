import type { Course, Module } from "../../domain/types/catalog";
import type { Quiz } from "../../domain/types/quiz";
import { getModuleById } from "./catalogSelectors";
import { getQuizById } from "./quizSelectors";

/** Quizzes scoped to the module (not tied to a specific lesson). */
export function getModuleLevelQuizzes(module: Module): Quiz[] {
  return module.quizzes.filter((q) => !q.lessonId);
}

/**
 * Resolves a module-level quiz for full-page display (`?quiz=` on module route).
 * Returns null when the id is missing, unknown, or belongs to a lesson quiz.
 */
export function resolveActiveModulePageQuiz(
  course: Course,
  moduleId: string,
  activeQuizId: string | null,
): Quiz | null {
  if (!activeQuizId) return null;

  const mod = getModuleById(course, moduleId);
  if (!mod) return null;

  const quiz = getQuizById(course, activeQuizId, { moduleId });
  if (!quiz) return null;

  return getModuleLevelQuizzes(mod).some((q) => q.id === quiz.id) ? quiz : null;
}
