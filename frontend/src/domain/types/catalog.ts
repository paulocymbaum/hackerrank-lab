export type Catalog = {
  courses: Course[];
};

export type Course = {
  id: string;
  title: string;
  readmePath: string;
  readmeMarkdown: string;
  lessons: Lesson[];
  projects: Project[];
};

export type Lesson = {
  title: string;
  path: string;
  markdown: string;
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
};

