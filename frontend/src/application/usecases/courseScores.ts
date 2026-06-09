import type { CourseScoreRepository } from "../../domain/repositories/quizScoreRepository";
import type { QuizAttempt } from "../../domain/types/quiz";
import type { ProjectStatus } from "../../domain/types/quizScore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizSessionStore";

let repository: CourseScoreRepository | null = null;

export function setCourseScoreRepository(next: CourseScoreRepository): void {
  repository = next;
}

/** @deprecated Use setCourseScoreRepository */
export const setQuizScoreRepository = setCourseScoreRepository;

export async function loadCourseScores(courseId: string): Promise<void> {
  if (!repository) return;

  const file = await repository.load(courseId);
  if (!file) return;

  useQuizProgressStore.getState().hydrateCourseScores(courseId, file);
  useProjectProgressStore.getState().hydrateCourseScores(courseId, file);
}

/** @deprecated Use loadCourseScores */
export const loadCourseQuizScores = loadCourseScores;

export async function persistQuizScore(
  courseId: string,
  quizId: string,
  attempt: QuizAttempt,
  lessonId?: string,
): Promise<void> {
  if (!repository) return;

  try {
    await repository.recordQuizAttempt(courseId, quizId, attempt, lessonId);
  } catch {
    // Dev server may be unavailable; localStorage progress still works.
  }
}

export async function persistProjectStatus(
  courseId: string,
  projectId: string,
  status: ProjectStatus,
  lessonId?: string,
): Promise<void> {
  if (!repository) return;

  try {
    await repository.setProjectStatus(courseId, projectId, status, lessonId);
  } catch {
    // Dev server may be unavailable; localStorage progress still works.
  }
}
