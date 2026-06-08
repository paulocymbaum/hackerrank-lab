import { create } from "zustand";
import type { ReaderItem, ReaderTab } from "../../domain/types/reader";

type ContentReaderState = {
  isOpen: boolean;
  item: ReaderItem | null;
  tab: ReaderTab;
  cwd: string;
  selectedFilePath: string | null;
  open: (item: ReaderItem, options?: { tab?: ReaderTab }) => void;
  close: () => void;
  setTab: (tab: ReaderTab) => void;
  setCwd: (cwd: string) => void;
  selectFile: (filePath: string) => void;
};

export const useContentReaderStore = create<ContentReaderState>((set) => ({
  isOpen: false,
  item: null,
  tab: "explanation",
  cwd: "",
  selectedFilePath: null,
  open: (item, options) =>
    set({
      isOpen: true,
      item,
      tab: options?.tab ?? "explanation",
      cwd: "",
      selectedFilePath: null,
    }),
  close: () =>
    set({
      isOpen: false,
      item: null,
      tab: "explanation",
      cwd: "",
      selectedFilePath: null,
    }),
  setTab: (tab) => set({ tab }),
  setCwd: (cwd) => set({ cwd, selectedFilePath: null }),
  selectFile: (filePath) => set({ selectedFilePath: filePath, tab: "files" }),
}));
