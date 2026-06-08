import { useMemo } from "react";
import { getCourseById } from "../selectors/catalogSelectors";
import { useCatalog } from "./useCatalog";

export function useCourse(courseId: string) {
  const { status, courses, error, load, reload } = useCatalog();

  const course = useMemo(() => getCourseById(courses, courseId), [courses, courseId]);

  return { course, status, error, load, reload };
}
