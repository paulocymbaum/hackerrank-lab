export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: string;
};

/** Embedded in catalog.json after generation. */
export type Quiz = {
  id: string;
  title: string;
  description?: string;
  /** POSIX path to source JSON under course/ */
  path: string;
  questions: QuizQuestion[];
  lessonId?: string;
  moduleId?: string;
  graphIndex?: string;
};

export type QuizAttempt = {
  score: number;
  total: number;
  completedAt: string;
};

export type QuizProgress = {
  bestScore: number;
  bestTotal: number;
  attempts: number;
  lastAttempt?: QuizAttempt;
};

export type QuizAnswerMap = Record<string, string>;

export function scoreQuiz(questions: QuizQuestion[], answers: QuizAnswerMap): QuizAttempt {
  let score = 0;
  for (const question of questions) {
    if (answers[question.id] === question.correctOptionId) score += 1;
  }
  return {
    score,
    total: questions.length,
    completedAt: new Date().toISOString(),
  };
}

export function quizProgressKey(courseId: string, quizId: string, lessonId?: string): string {
  return `${courseId}:quiz:${lessonId ?? "_"}:${quizId}`;
}
