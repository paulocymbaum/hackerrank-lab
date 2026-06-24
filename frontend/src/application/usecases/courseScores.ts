import type { CourseScoreRepository } from "../../domain/repositories/quizScoreRepository";
import type { QuizAttempt } from "../../domain/types/quiz";
import type { CourseScoreFile, ProjectStatus } from "../../domain/types/quizScore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

let repository: CourseScoreRepository | null = null;

export function setCourseScoreRepository(next: CourseScoreRepository): void {
  repository = next;
}

export function hydrateCourseScoresFromFile(courseId: string, file: CourseScoreFile): void {
  useQuizProgressStore.getState().hydrateCourseScores(courseId, file);
  useProjectProgressStore.getState().hydrateCourseScores(courseId, file);
}

export async function loadCourseScores(courseId: string): Promise<void> {
  if (!repository) return;

  const file = await repository.load(courseId);
  if (!file) return;

  hydrateCourseScoresFromFile(courseId, file);
}

export async function persistQuizScore(
  courseId: string,
  quizId: string,
  attempt: QuizAttempt,
  lessonId?: string,
): Promise<void> {
  if (!repository) return;

  try {
    const file = await repository.recordQuizAttempt(courseId, quizId, attempt, lessonId);
    hydrateCourseScoresFromFile(courseId, file);
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
    const file = await repository.setProjectStatus(courseId, projectId, status, lessonId);
    hydrateCourseScoresFromFile(courseId, file);
  } catch {
    // Dev server may be unavailable; localStorage progress still works.
  }
}
