import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectDeliveryEntry } from "../../domain/types/projectDelivery";
import {
  appendProjectDelivery,
  emptyProjectDeliveryFile,
  mergeDeliveryFileIntoStore,
} from "../../domain/types/projectDelivery";
import { projectProgressKey } from "../../domain/types/quizScore";
import { persistProjectDelivery } from "../usecases/projectDeliveries";

type ProjectDeliveryMeta = {
  loading: boolean;
  error: string | null;
};

type ProjectDeliveryState = {
  deliveriesByKey: Record<string, ProjectDeliveryEntry[]>;
  metaByKey: Record<string, ProjectDeliveryMeta>;
  getDeliveries: (courseId: string, projectId: string) => ProjectDeliveryEntry[];
  getMeta: (courseId: string, projectId: string) => ProjectDeliveryMeta;
  setLoading: (courseId: string, projectId: string, loading: boolean) => void;
  setError: (courseId: string, projectId: string, error: string | null) => void;
  hydrate: (courseId: string, projectId: string, deliveries: ProjectDeliveryEntry[]) => void;
  submitDelivery: (
    courseId: string,
    projectId: string,
    rootPath: string,
    content: string,
  ) => Promise<boolean>;
};

function defaultMeta(): ProjectDeliveryMeta {
  return { loading: false, error: null };
}

export const useProjectDeliveryStore = create<ProjectDeliveryState>()(
  persist(
    (set, get) => ({
      deliveriesByKey: {},
      metaByKey: {},

      getDeliveries: (courseId, projectId) => {
        const key = projectProgressKey(courseId, projectId);
        return get().deliveriesByKey[key] ?? [];
      },

      getMeta: (courseId, projectId) => {
        const key = projectProgressKey(courseId, projectId);
        return get().metaByKey[key] ?? defaultMeta();
      },

      setLoading: (courseId, projectId, loading) => {
        const key = projectProgressKey(courseId, projectId);
        set((state) => ({
          metaByKey: {
            ...state.metaByKey,
            [key]: { ...(state.metaByKey[key] ?? defaultMeta()), loading },
          },
        }));
      },

      setError: (courseId, projectId, error) => {
        const key = projectProgressKey(courseId, projectId);
        set((state) => ({
          metaByKey: {
            ...state.metaByKey,
            [key]: { ...(state.metaByKey[key] ?? defaultMeta()), error },
          },
        }));
      },

      hydrate: (courseId, projectId, deliveries) => {
        const key = projectProgressKey(courseId, projectId);
        set((state) => ({
          deliveriesByKey: mergeDeliveryFileIntoStore(
            courseId,
            projectId,
            { ...emptyProjectDeliveryFile({ courseId, projectId }), deliveries },
            state.deliveriesByKey,
          ),
        }));
      },

      submitDelivery: async (courseId, projectId, rootPath, content) => {
        const key = projectProgressKey(courseId, projectId);
        const trimmed = content.trim();
        if (!trimmed) return false;

        const prev = get().deliveriesByKey[key] ?? [];
        const file = appendProjectDelivery(
          { ...emptyProjectDeliveryFile({ courseId, projectId }), deliveries: prev },
          trimmed,
        );

        set((state) => ({
          deliveriesByKey: {
            ...state.deliveriesByKey,
            [key]: file.deliveries,
          },
        }));

        const persisted = await persistProjectDelivery(courseId, projectId, rootPath, trimmed);
        if (!persisted) {
          set((state) => ({
            metaByKey: {
              ...state.metaByKey,
              [key]: {
                ...(state.metaByKey[key] ?? defaultMeta()),
                error: "Saved locally; dev server unavailable for disk sync",
              },
            },
          }));
        }

        return true;
      },
    }),
    { name: "hackerrank-study-project-deliveries" },
  ),
);
