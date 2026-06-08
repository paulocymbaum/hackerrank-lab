import { create } from "zustand";
import type { Course } from "../../domain/types/catalog";
import type { CatalogRepository } from "../../domain/repositories/catalogRepository";
import { loadCatalog } from "../usecases/loadCatalog";
import { staticCatalogRepository } from "../../infrastructure/repositories/staticCatalogRepository";

type Status = "idle" | "loading" | "ready" | "error";

type CourseCatalogState = {
  status: Status;
  courses: Course[];
  error: string | null;
  load: () => Promise<void>;
  reload: () => Promise<void>;
};

function createCatalogLoader(repository: CatalogRepository) {
  return async (force: boolean, set: (partial: Partial<CourseCatalogState>) => void, get: () => CourseCatalogState) => {
    const current = get().status;
    if (!force && (current === "loading" || current === "ready")) return;

    set({ status: "loading", error: null });
    const result = await loadCatalog(repository);
    if (result.ok) {
      set({ status: "ready", courses: result.courses });
    } else {
      set({ status: "error", error: result.error });
    }
  };
}

const fetchCatalog = createCatalogLoader(staticCatalogRepository);

export const useCourseCatalogStore = create<CourseCatalogState>((set, get) => ({
  status: "idle",
  courses: [],
  error: null,
  load: () => fetchCatalog(false, set, get),
  reload: () => fetchCatalog(true, set, get),
}));
