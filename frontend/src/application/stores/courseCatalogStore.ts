import { create } from "zustand";
import type { Course } from "../../domain/types/catalog";
import { staticCatalogRepository } from "../../infrastructure/repositories/staticCatalogRepository";

type Status = "idle" | "loading" | "ready" | "error";

type CourseCatalogState = {
  status: Status;
  courses: Course[];
  error: string | null;
  load: () => Promise<void>;
};

export const useCourseCatalogStore = create<CourseCatalogState>((set, get) => ({
  status: "idle",
  courses: [],
  error: null,
  load: async () => {
    const current = get().status;
    if (current === "loading" || current === "ready") return;

    set({ status: "loading", error: null });
    try {
      const catalog = await staticCatalogRepository.getCatalog();
      set({ status: "ready", courses: catalog.courses });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      set({ status: "error", error: message });
    }
  },
}));

