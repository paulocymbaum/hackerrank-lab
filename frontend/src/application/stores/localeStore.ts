import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  detectBrowserLocale,
  type AppLocale,
} from "../../domain/types/locale";

type LocaleState = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: detectBrowserLocale(),
      setLocale: (locale) => set({ locale }),
    }),
    { name: "hackerrank-study-locale" },
  ),
);
