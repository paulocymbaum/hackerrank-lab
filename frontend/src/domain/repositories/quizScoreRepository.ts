import type { QuizAttempt } from "../types/quiz";
import type { CourseScoreFile, ProjectStatus } from "../types/quizScore";

export type CourseScoreRepository = {
  load(courseId: string): Promise<CourseScoreFile | null>;
  recordQuizAttempt(
    courseId: string,
    quizId: string,
    attempt: QuizAttempt,
    lessonId?: string,
  ): Promise<void>;
  setProjectStatus(
    courseId: string,
    projectId: string,
    status: ProjectStatus,
    lessonId?: string,
  ): Promise<void>;
};

/** @deprecated Use CourseScoreRepository */
export type QuizScoreRepository = CourseScoreRepository;
