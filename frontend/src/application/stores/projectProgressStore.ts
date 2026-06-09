import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectProgress, ProjectStatus, CourseScoreFile } from "../../domain/types/quizScore";
import {
  mergeScoreFileIntoProjectProgress,
  projectPointsForStatus,
  projectProgressKey,
} from "../../domain/types/quizScore";
import { persistProjectStatus } from "../usecases/courseScores";
import { resolveProjectProgressKey } from "../usecases/migrateProgressKeys";

type ProjectProgressState = {
  byKey: Record<string, ProjectProgress>;
  getStatus: (courseId: string, projectId: string, lessonId?: string) => ProjectStatus;
  getProgress: (courseId: string, projectId: string, lessonId?: string) => ProjectProgress | null;
  setStatus: (courseId: string, projectId: string, status: ProjectStatus, lessonId?: string) => void;
  markProjectDoing: (courseId: string, projectId: string, lessonId?: string) => void;
  markProjectDone: (courseId: string, projectId: string, lessonId?: string) => void;
  hydrateCourseScores: (courseId: string, file: CourseScoreFile) => void;
};

export const useProjectProgressStore = create<ProjectProgressState>()(
  persist(
    (set, get) => ({
      byKey: {},
      getStatus: (courseId, projectId, lessonId) => {
        const key = resolveProjectProgressKey(courseId, projectId, lessonId, get().byKey);
        return get().byKey[key]?.status ?? "pending";
      },
      getProgress: (courseId, projectId, lessonId) => {
        const key = resolveProjectProgressKey(courseId, projectId, lessonId, get().byKey);
        return get().byKey[key] ?? null;
      },
      setStatus: (courseId, projectId, status, lessonId) => {
        const key = projectProgressKey(courseId, projectId, lessonId);
        const updatedAt = new Date().toISOString();
        set((state) => ({
          byKey: {
            ...state.byKey,
            [key]: {
              status,
              points: projectPointsForStatus(status),
              updatedAt,
            },
          },
        }));
        void persistProjectStatus(courseId, projectId, status, lessonId);
      },
      markProjectDoing: (courseId, projectId, lessonId) => {
        const current = get().getStatus(courseId, projectId, lessonId);
        if (current !== "pending") return;
        get().setStatus(courseId, projectId, "doing", lessonId);
      },
      markProjectDone: (courseId, projectId, lessonId) => {
        const current = get().getStatus(courseId, projectId, lessonId);
        if (current === "done") return;
        get().setStatus(courseId, projectId, "done", lessonId);
      },
      hydrateCourseScores: (courseId, file) => {
        set((state) => ({
          byKey: mergeScoreFileIntoProjectProgress(courseId, file, state.byKey),
        }));
      },
    }),
    { name: "hackerrank-study-project-progress" },
  ),
);
