import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectProgress, ProjectStatus, CourseScoreFile } from "../../domain/types/quizScore";
import {
  mergeScoreFileIntoProjectProgress,
  projectPointsForStatus,
  projectProgressKey,
} from "../../domain/types/quizScore";
import { persistProjectStatus } from "../usecases/courseScores";

type ProjectProgressState = {
  byKey: Record<string, ProjectProgress>;
  getStatus: (courseId: string, projectId: string) => ProjectStatus;
  getProgress: (courseId: string, projectId: string) => ProjectProgress | null;
  setStatus: (courseId: string, projectId: string, status: ProjectStatus) => void;
  markProjectDoing: (courseId: string, projectId: string) => void;
  markProjectDone: (courseId: string, projectId: string) => void;
  hydrateCourseScores: (courseId: string, file: CourseScoreFile) => void;
};

export const useProjectProgressStore = create<ProjectProgressState>()(
  persist(
    (set, get) => ({
      byKey: {},
      getStatus: (courseId, projectId) => {
        const key = projectProgressKey(courseId, projectId);
        return get().byKey[key]?.status ?? "pending";
      },
      getProgress: (courseId, projectId) => {
        const key = projectProgressKey(courseId, projectId);
        return get().byKey[key] ?? null;
      },
      setStatus: (courseId, projectId, status) => {
        const key = projectProgressKey(courseId, projectId);
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
        void persistProjectStatus(courseId, projectId, status);
      },
      markProjectDoing: (courseId, projectId) => {
        const current = get().getStatus(courseId, projectId);
        if (current !== "pending") return;
        get().setStatus(courseId, projectId, "doing");
      },
      markProjectDone: (courseId, projectId) => {
        const current = get().getStatus(courseId, projectId);
        if (current === "done") return;
        get().setStatus(courseId, projectId, "done");
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
