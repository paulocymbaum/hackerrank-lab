import type { Course, Lesson, Project } from "../../domain/types/catalog";
import type { ReaderItem } from "../../domain/types/reader";

export function getCourseById(courses: Course[], courseId: string): Course | null {
  return courses.find((c) => c.id === courseId) ?? null;
}

export function lessonToReaderItem(lesson: Lesson): ReaderItem {
  const fileName = lesson.path.split("/").slice(-1)[0] ?? lesson.path;
  return {
    kind: "lesson",
    title: lesson.title,
    path: lesson.path,
    markdown: lesson.markdown,
    entries: [{ path: fileName, kind: "file", content: lesson.markdown }],
  };
}

export function projectToReaderItem(project: Project): ReaderItem {
  return {
    kind: "project",
    title: project.title,
    path: project.readmePath,
    markdown: project.readmeMarkdown,
    rootPath: project.rootPath,
    projectId: project.id,
    entries: project.entries,
  };
}

export function getLessonSequence(course: Course): Lesson[] {
  return [...course.lessons];
}

export function getProjectSequence(course: Course): Project[] {
  return [...course.projects];
}

export function findReaderItemByPath(courses: Course[], path: string): ReaderItem | null {
  for (const course of courses) {
    for (const lesson of course.lessons) {
      if (lesson.path === path) return lessonToReaderItem(lesson);
    }
    for (const project of course.projects) {
      if (project.readmePath === path || project.rootPath === path) {
        return projectToReaderItem(project);
      }
    }
  }
  return null;
}
