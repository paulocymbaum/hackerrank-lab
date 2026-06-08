import type { Course } from "../../domain/types/catalog";
import { loadCourseScores } from "./courseScores";

export async function loadAllCourseScores(courses: Course[]): Promise<void> {
  await Promise.all(courses.map((course) => loadCourseScores(course.id)));
}
