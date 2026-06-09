import { useMemo } from "react";
import type { Course } from "../../domain/types/catalog";
import { quizProgressKey } from "../../domain/types/quiz";
import {
  computeCoursePoints,
  projectProgressKey,
  withCourseMaxPoints,
  type CoursePointsWithMax,
} from "../../domain/types/quizScore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizSessionStore";

export function useCoursePoints(courseId: string, course: Course): CoursePointsWithMax {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  return useMemo(() => {
    const quizBestScores = course.quizzes.map(
      (quiz) =>
        quizByKey[quizProgressKey(courseId, quiz.id, quiz.lessonId)]?.bestScore ?? 0,
    );
    const projectStatuses = course.projects.map(
      (project) =>
        projectByKey[projectProgressKey(courseId, project.id, project.lessonId)]?.status ??
        "pending",
    );
    return withCourseMaxPoints(course, computeCoursePoints({ quizBestScores, projectStatuses }));
  }, [course, courseId, projectByKey, quizByKey]);
}
