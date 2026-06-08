export type ReaderItemKind = "lesson" | "project";

export type ReaderTab = "folders" | "explanation" | "files";

export type ReaderEntry = {
  path: string;
  kind: "dir" | "file";
  readmeMarkdown?: string;
  content?: string;
};

export type ReaderItem = {
  kind: ReaderItemKind;
  title: string;
  path: string;
  markdown: string;
  rootPath?: string;
  entries?: ReaderEntry[];
};
