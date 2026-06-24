import type { Course, Lesson, Module, Project } from "../../domain/types/catalog";
import type { Quiz } from "../../domain/types/quiz";
import type { ReaderItem } from "../../domain/types/reader";

export function getCourseById(courses: Course[], courseId: string): Course | null {
  return courses.find((c) => c.id === courseId) ?? null;
}

export function isHierarchyCourse(course: Course): boolean {
  return course.structure === "hierarchy" && Boolean(course.modules?.length);
}

export function getModuleById(course: Course, moduleId: string): Module | null {
  return course.modules?.find((m) => m.id === moduleId) ?? null;
}

export function getLessonById(course: Course, moduleId: string, lessonId: string): Lesson | null {
  const mod = getModuleById(course, moduleId);
  return mod?.lessons.find((l) => l.id === lessonId) ?? null;
}

export function getLessonsForModule(course: Course, moduleId: string): Lesson[] {
  return getModuleById(course, moduleId)?.lessons ?? [];
}

export function getProjectById(
  course: Course,
  moduleId: string,
  projectId: string,
): Project | null {
  return getModuleById(course, moduleId)?.projects.find((p) => p.id === projectId) ?? null;
}

export function getProjectsForModule(course: Course, moduleId: string): Project[] {
  return getModuleById(course, moduleId)?.projects ?? [];
}

export function getProjectsForLesson(
  course: Course,
  moduleId: string,
  lessonId: string,
): Project[] {
  const mod = getModuleById(course, moduleId);
  if (!mod) return [];
  return mod.projects.filter((p) => p.lessonId === lessonId);
}

export function getQuizzesForLesson(course: Course, moduleId: string, lessonId: string): Quiz[] {
  const mod = getModuleById(course, moduleId);
  if (!mod) return [];
  return mod.quizzes.filter((q) => q.lessonId === lessonId);
}

export function getQuizzesForModule(course: Course, moduleId: string): Quiz[] {
  return getModuleById(course, moduleId)?.quizzes ?? [];
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
    lessonId: project.lessonId,
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
    for (const mod of course.modules ?? []) {
      for (const lesson of mod.lessons) {
        if (lesson.path === path) return lessonToReaderItem(lesson);
      }
      for (const project of mod.projects) {
        if (project.readmePath === path || project.rootPath === path) {
          return projectToReaderItem(project);
        }
      }
    }
  }
  return null;
}

export function countCourseLessons(course: Course): number {
  if (isHierarchyCourse(course)) {
    return (course.modules ?? []).reduce((sum, mod) => sum + mod.lessons.length, 0);
  }
  return course.lessons.length;
}
