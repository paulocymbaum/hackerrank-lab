import { create } from "zustand";
import type { CourseTab } from "../../../domain/types/navigation";

type CourseExperienceState = {
  tabByCourseId: Record<string, CourseTab>;
  getTab: (courseId: string) => CourseTab;
  setTab: (courseId: string, tab: CourseTab) => void;
};

export const useCourseExperienceStore = create<CourseExperienceState>((set, get) => ({
  tabByCourseId: {},
  getTab: (courseId) => get().tabByCourseId[courseId] ?? "readme",
  setTab: (courseId, tab) =>
    set((state) => ({
      tabByCourseId: { ...state.tabByCourseId, [courseId]: tab },
    })),
}));
