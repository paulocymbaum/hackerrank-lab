import type { CourseScoreRepository } from "../../domain/repositories/quizScoreRepository";
import type { QuizAttempt } from "../../domain/types/quiz";
import type { ProjectStatus } from "../../domain/types/quizScore";
import { normalizeCourseScoreFile } from "../../domain/types/quizScore";

const API_PREFIX = "/api/quiz-scores/";

export const httpCourseScoreRepository: CourseScoreRepository = {
  async load(courseId) {
    try {
      const res = await fetch(`${API_PREFIX}${encodeURIComponent(courseId)}`);
      if (res.status === 404) return null;
      if (!res.ok) return null;
      const data: unknown = await res.json();
      return normalizeCourseScoreFile(data, courseId);
    } catch {
      return null;
    }
  },

  async recordQuizAttempt(courseId, quizId, attempt) {
    const res = await fetch(`${API_PREFIX}${encodeURIComponent(courseId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "quiz",
        quizId,
        attempt,
      } satisfies RecordQuizAttemptBody),
    });
    if (!res.ok) {
      throw new Error(`Failed to persist quiz score (${res.status})`);
    }
  },

  async setProjectStatus(courseId, projectId, status) {
    const res = await fetch(`${API_PREFIX}${encodeURIComponent(courseId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "project",
        projectId,
        status,
      } satisfies RecordProjectStatusBody),
    });
    if (!res.ok) {
      throw new Error(`Failed to persist project status (${res.status})`);
    }
  },
};

/** @deprecated Use httpCourseScoreRepository */
export const httpQuizScoreRepository = httpCourseScoreRepository;

type RecordQuizAttemptBody = {
  kind: "quiz";
  quizId: string;
  attempt: QuizAttempt;
};

type RecordProjectStatusBody = {
  kind: "project";
  projectId: string;
  status: ProjectStatus;
};