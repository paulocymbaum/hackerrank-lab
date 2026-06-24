import { useEffect } from "react";
import { loadCourseScores } from "../usecases/courseScores";
import { useCourse } from "./useCourse";

export function useCourseRouteData(courseId: string) {
  const { course, status, error, load, reload } = useCourse(courseId);

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  useEffect(() => {
    if (!courseId || status !== "ready") return;
    void loadCourseScores(courseId);
  }, [courseId, status]);

  return { course, status, error, reload };
}
