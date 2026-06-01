import { create } from "zustand";

export type ReaderItemKind = "lesson" | "project";

export type ReaderTab = "folders" | "explanation" | "files";

export type ReaderEntry = {
  /** Path relative to the item's root ("" means root dir). */
  path: string;
  kind: "dir" | "file";
  readmeMarkdown?: string;
  content?: string;
};

export type ReaderItem = {
  kind: ReaderItemKind;
  title: string;
  /** For lessons: markdown file path. For projects: root README path. */
  path: string;
  /** The top-level README / lesson markdown. */
  markdown: string;
  /** For projects: root folder path. For lessons: same as dirname(path). */
  rootPath?: string;
  /** For projects: folder/file manifest. For lessons: optional single-file manifest. */
  entries?: ReaderEntry[];
};

type ContentReaderState = {
  isOpen: boolean;
  item: ReaderItem | null;
  tab: ReaderTab;
  cwd: string;
  selectedFilePath: string | null;
  open: (item: ReaderItem) => void;
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
  open: (item) =>
    set({
      isOpen: true,
      item,
      tab: "explanation",
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
  setCwd: (cwd) => set({ cwd }),
  selectFile: (filePath) => set({ selectedFilePath: filePath, tab: "files" }),
}));

