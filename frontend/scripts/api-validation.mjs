/** Shared validation for dev API plugins (quiz scores, project deliveries). */

export const COURSE_ID_PATTERN = /^[\w][\w-]*$/;

export function isValidCourseId(courseId) {
  return typeof courseId === "string" && COURSE_ID_PATTERN.test(courseId);
}

export function isValidProjectRootPath(courseId, rootPath) {
  if (typeof rootPath !== "string" || !rootPath.trim()) return false;
  if (!rootPath.startsWith(`course/${courseId}/`)) return false;
  if (!rootPath.includes("/projects/")) return false;
  if (rootPath.includes("..")) return false;
  return true;
}
