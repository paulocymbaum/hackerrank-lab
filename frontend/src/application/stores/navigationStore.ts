import { create } from "zustand";
import type { Route } from "../../domain/types/navigation";
import { closeReaderBeforeNavigate } from "../usecases/navigateWithCleanup";

type NavigationState = {
  route: Route;
  goCatalog: () => void;
  goCourse: (courseId: string) => void;
};

export const useNavigationStore = create<NavigationState>((set) => ({
  route: { name: "catalog" },
  goCatalog: () => {
    closeReaderBeforeNavigate();
    set({ route: { name: "catalog" } });
  },
  goCourse: (courseId) => {
    closeReaderBeforeNavigate();
    set({ route: { name: "course", courseId } });
  },
}));
