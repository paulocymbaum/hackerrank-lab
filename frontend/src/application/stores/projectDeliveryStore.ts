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
  draftByKey: Record<string, string>;
  getDeliveries: (courseId: string, projectId: string, lessonId?: string) => ProjectDeliveryEntry[];
  getMeta: (courseId: string, projectId: string, lessonId?: string) => ProjectDeliveryMeta;
  getDraft: (courseId: string, projectId: string, lessonId?: string) => string;
  setDraft: (
    courseId: string,
    projectId: string,
    content: string | ((current: string) => string),
    lessonId?: string,
  ) => void;
  setLoading: (courseId: string, projectId: string, loading: boolean, lessonId?: string) => void;
  setError: (courseId: string, projectId: string, error: string | null, lessonId?: string) => void;
  hydrate: (
    courseId: string,
    projectId: string,
    deliveries: ProjectDeliveryEntry[],
    lessonId?: string,
  ) => void;
  submitDelivery: (
    courseId: string,
    projectId: string,
    rootPath: string,
    content: string,
    lessonId?: string,
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
      draftByKey: {},

      getDeliveries: (courseId, projectId, lessonId) => {
        const key = projectProgressKey(courseId, projectId, lessonId);
        return get().deliveriesByKey[key] ?? [];
      },

      getMeta: (courseId, projectId, lessonId) => {
        const key = projectProgressKey(courseId, projectId, lessonId);
        return get().metaByKey[key] ?? defaultMeta();
      },

      getDraft: (courseId, projectId, lessonId) => {
        const key = projectProgressKey(courseId, projectId, lessonId);
        return get().draftByKey[key] ?? "";
      },

      setDraft: (courseId, projectId, content, lessonId) => {
        const key = projectProgressKey(courseId, projectId, lessonId);
        set((state) => {
          const current = state.draftByKey[key] ?? "";
          const next = typeof content === "function" ? content(current) : content;
          return {
            draftByKey: {
              ...state.draftByKey,
              [key]: next,
            },
          };
        });
      },

      setLoading: (courseId, projectId, loading, lessonId) => {
        const key = projectProgressKey(courseId, projectId, lessonId);
        set((state) => ({
          metaByKey: {
            ...state.metaByKey,
            [key]: { ...(state.metaByKey[key] ?? defaultMeta()), loading },
          },
        }));
      },

      setError: (courseId, projectId, error, lessonId) => {
        const key = projectProgressKey(courseId, projectId, lessonId);
        set((state) => ({
          metaByKey: {
            ...state.metaByKey,
            [key]: { ...(state.metaByKey[key] ?? defaultMeta()), error },
          },
        }));
      },

      hydrate: (courseId, projectId, deliveries, lessonId) => {
        const key = projectProgressKey(courseId, projectId, lessonId);
        set((state) => ({
          deliveriesByKey: mergeDeliveryFileIntoStore(
            courseId,
            projectId,
            { ...emptyProjectDeliveryFile({ courseId, projectId }), deliveries },
            state.deliveriesByKey,
            lessonId,
          ),
        }));
      },

      submitDelivery: async (courseId, projectId, rootPath, content, lessonId) => {
        const key = projectProgressKey(courseId, projectId, lessonId);
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
    {
      name: "hackerrank-study-project-deliveries",
      partialize: (state) => ({
        deliveriesByKey: state.deliveriesByKey,
        metaByKey: state.metaByKey,
      }),
    },
  ),
);
