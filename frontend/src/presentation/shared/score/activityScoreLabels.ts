import type { Quiz, QuizProgress } from "../../../domain/types/quiz";
import type { ProjectStatus } from "../../../domain/types/quizScore";
import { PROJECT_POINTS_WEIGHT } from "../../../domain/types/quizScore";

export function formatQuizScoreLabel(quiz: Quiz, progress: QuizProgress | null): string {
  if (progress) {
    const attempts = progress.attempts > 1 ? ` · ${progress.attempts} attempts` : "";
    return `Best: ${progress.bestScore}/${progress.bestTotal} pts${attempts}`;
  }
  return `Up to ${quiz.questions.length} pts`;
}

export function quizProgressMetrics(
  quiz: Quiz,
  progress: QuizProgress | null,
): { value: number; max: number } {
  return {
    value: progress?.bestScore ?? 0,
    max: progress?.bestTotal ?? quiz.questions.length,
  };
}

export function formatProjectScoreLabel(status: ProjectStatus, points = 0): string {
  if (status === "done") return `Done · ${points} pts`;
  if (status === "doing") return `In progress · 0 pts`;
  return `0 / ${PROJECT_POINTS_WEIGHT} pts`;
}
