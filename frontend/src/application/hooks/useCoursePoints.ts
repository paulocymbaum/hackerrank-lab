import { useMemo } from "react";
import type { Course } from "../../domain/types/catalog";
import { quizProgressKey } from "../../domain/types/quiz";
import {
  computeCoursePoints,
  projectProgressKey,
  withCourseMaxPointsFromItems,
  type CoursePointsWithMax,
} from "../../domain/types/quizScore";
import {
  getAllProjectsForCourse,
  getAllQuizzesForCourse,
} from "../selectors/catalogSelectors";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

export function useCoursePoints(courseId: string, course: Course): CoursePointsWithMax {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  return useMemo(() => {
    const quizzes = getAllQuizzesForCourse(course);
    const projects = getAllProjectsForCourse(course);

    const quizBestScores = quizzes.map(
      (quiz) =>
        quizByKey[quizProgressKey(courseId, quiz.id, quiz.lessonId)]?.bestScore ?? 0,
    );
    const projectStatuses = projects.map(
      (project) =>
        projectByKey[projectProgressKey(courseId, project.id, project.lessonId)]?.status ??
        "pending",
    );
    return withCourseMaxPointsFromItems(
      quizzes,
      projects.length,
      computeCoursePoints({ quizBestScores, projectStatuses }),
    );
  }, [course, courseId, projectByKey, quizByKey]);
}
