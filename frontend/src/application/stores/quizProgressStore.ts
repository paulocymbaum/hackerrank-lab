import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuizAttempt, QuizProgress } from "../../domain/types/quiz";
import { quizProgressKey } from "../../domain/types/quiz";
import type { CourseScoreFile } from "../../domain/types/quizScore";
import { mergeScoreFileIntoQuizProgress } from "../../domain/types/quizScore";
import { resolveQuizProgressKey } from "../usecases/migrateProgressKeys";

type QuizProgressState = {
  byKey: Record<string, QuizProgress>;
  getProgress: (courseId: string, quizId: string, lessonId?: string) => QuizProgress | null;
  recordAttempt: (
    courseId: string,
    quizId: string,
    attempt: QuizAttempt,
    lessonId?: string,
  ) => void;
  hydrateCourseScores: (courseId: string, file: CourseScoreFile) => void;
};

export const useQuizProgressStore = create<QuizProgressState>()(
  persist(
    (set, get) => ({
      byKey: {},
      getProgress: (courseId, quizId, lessonId) => {
        const key = resolveQuizProgressKey(courseId, quizId, lessonId, get().byKey);
        return get().byKey[key] ?? null;
      },
      recordAttempt: (courseId, quizId, attempt, lessonId) => {
        const key = quizProgressKey(courseId, quizId, lessonId);
        set((state) => {
          const prev = state.byKey[key];
          return {
            byKey: {
              ...state.byKey,
              [key]: {
                bestScore: Math.max(prev?.bestScore ?? 0, attempt.score),
                bestTotal: attempt.total,
                attempts: (prev?.attempts ?? 0) + 1,
                lastAttempt: attempt,
              },
            },
          };
        });
      },
      hydrateCourseScores: (courseId, file) => {
        set((state) => ({
          byKey: mergeScoreFileIntoQuizProgress(courseId, file, state.byKey),
        }));
      },
    }),
    { name: "hackerrank-study-quiz-progress" },
  ),
);
