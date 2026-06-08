import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuizAnswerMap, QuizAttempt, QuizProgress, Quiz } from "../../domain/types/quiz";
import { quizProgressKey, scoreQuiz } from "../../domain/types/quiz";
import type { CourseScoreFile } from "../../domain/types/quizScore";
import { mergeScoreFileIntoQuizProgress } from "../../domain/types/quizScore";
import { persistQuizScore } from "../usecases/courseScores";

type QuizSessionState = {
  quizId: string | null;
  currentIndex: number;
  answers: QuizAnswerMap;
  checkedQuestions: Record<string, boolean>;
  isComplete: boolean;
  lastAttempt: QuizAttempt | null;
  lastQuizPointsDelta: number;
  start: (quizId: string) => void;
  reset: () => void;
  selectAnswer: (questionId: string, optionId: string) => void;
  checkCurrent: (questionId: string) => void;
  goNext: (totalQuestions: number) => void;
  goPrev: () => void;
  finish: (quiz: Quiz, courseId: string) => QuizAttempt;
};

const initialSession = {
  quizId: null as string | null,
  currentIndex: 0,
  answers: {} as QuizAnswerMap,
  checkedQuestions: {} as Record<string, boolean>,
  isComplete: false,
  lastAttempt: null as QuizAttempt | null,
  lastQuizPointsDelta: 0,
};

export const useQuizSessionStore = create<QuizSessionState>((set, get) => ({
  ...initialSession,
  start: (quizId) =>
    set({
      quizId,
      currentIndex: 0,
      answers: {},
      checkedQuestions: {},
      isComplete: false,
      lastAttempt: null,
      lastQuizPointsDelta: 0,
    }),
  reset: () => set(initialSession),
  selectAnswer: (questionId, optionId) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionId },
    })),
  checkCurrent: (questionId) =>
    set((state) => ({
      checkedQuestions: { ...state.checkedQuestions, [questionId]: true },
    })),
  goNext: (totalQuestions) =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, totalQuestions - 1),
    })),
  goPrev: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),
  finish: (quiz, courseId) => {
    const attempt = scoreQuiz(quiz.questions, get().answers);
    const prevBest =
      useQuizProgressStore.getState().getProgress(courseId, quiz.id)?.bestScore ?? 0;
    useQuizProgressStore.getState().recordAttempt(courseId, quiz.id, attempt);
    void persistQuizScore(courseId, quiz.id, attempt);
    const lastQuizPointsDelta = Math.max(0, attempt.score - prevBest);
    set({ isComplete: true, lastAttempt: attempt, lastQuizPointsDelta });
    return attempt;
  },
}));

type QuizProgressState = {
  byKey: Record<string, QuizProgress>;
  getProgress: (courseId: string, quizId: string) => QuizProgress | null;
  recordAttempt: (courseId: string, quizId: string, attempt: QuizAttempt) => void;
  hydrateCourseScores: (courseId: string, file: CourseScoreFile) => void;
};

export const useQuizProgressStore = create<QuizProgressState>()(
  persist(
    (set, get) => ({
      byKey: {},
      getProgress: (courseId, quizId) => {
        const key = quizProgressKey(courseId, quizId);
        return get().byKey[key] ?? null;
      },
      recordAttempt: (courseId, quizId, attempt) => {
        const key = quizProgressKey(courseId, quizId);
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
