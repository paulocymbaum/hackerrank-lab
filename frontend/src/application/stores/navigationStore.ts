import { create } from "zustand";

export type Route =
  | { name: "catalog" }
  | { name: "course"; courseId: string };

type NavigationState = {
  route: Route;
  goCatalog: () => void;
  goCourse: (courseId: string) => void;
};

export const useNavigationStore = create<NavigationState>((set) => ({
  route: { name: "catalog" },
  goCatalog: () => set({ route: { name: "catalog" } }),
  goCourse: (courseId) => set({ route: { name: "course", courseId } }),
}));

