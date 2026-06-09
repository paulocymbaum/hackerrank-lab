import type { Quiz } from "./quiz";

export type Catalog = {
  courses: Course[];
};

export type Course = {
  id: string;
  title: string;
  readmePath: string;
  readmeMarkdown: string;
  /** Present for hierarchy courses (course/<slug>/modules/) */
  modules?: Module[];
  lessons: Lesson[];
  projects: Project[];
  quizzes: Quiz[];
  /** `hierarchy` | `legacy` — omitted on older catalog entries */
  structure?: "hierarchy" | "legacy";
};

export type Module = {
  id: string;
  title: string;
  graphIndex?: string;
  readmePath: string;
  readmeMarkdown: string;
  lessons: Lesson[];
  projects: Project[];
  quizzes: Quiz[];
};

export type Lesson = {
  id: string;
  title: string;
  path: string;
  markdown: string;
  moduleId?: string;
  graphIndex?: string;
};

export type ProjectEntry = {
  /** POSIX path, relative to repo root */
  path: string;
  kind: "dir" | "file";
  /** For dir entries: README.md content (if present) */
  readmeMarkdown?: string;
  /** For file entries: UTF-8 file content (if supported/kept) */
  content?: string;
};

export type Project = {
  id: string;
  title: string;
  /** POSIX path to project root folder */
  rootPath: string;
  /** POSIX path to root README.md */
  readmePath: string;
  /** Root README.md markdown */
  readmeMarkdown: string;
  /** Flat manifest of folders/files under rootPath */
  entries: ProjectEntry[];
  moduleId?: string;
  lessonId?: string;
  graphIndex?: string;
};
