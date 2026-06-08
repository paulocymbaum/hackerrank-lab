import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuizAnswerMap, QuizAttempt, QuizProgress, Quiz } from "../../domain/types/quiz";
import { quizProgressKey, scoreQuiz } from "../../domain/types/quiz";

type QuizSessionState = {
  quizId: string | null;
  currentIndex: number;
  answers: QuizAnswerMap;
  checkedQuestions: Record<string, boolean>;
  isComplete: boolean;
  lastAttempt: QuizAttempt | null;
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
    useQuizProgressStore.getState().recordAttempt(courseId, quiz.id, attempt);
    set({ isComplete: true, lastAttempt: attempt });
    return attempt;
  },
}));

type QuizProgressState = {
  byKey: Record<string, QuizProgress>;
  getProgress: (courseId: string, quizId: string) => QuizProgress | null;
  recordAttempt: (courseId: string, quizId: string, attempt: QuizAttempt) => void;
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
    }),
    { name: "hackerrank-study-quiz-progress" },
  ),
);
