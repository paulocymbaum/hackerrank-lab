import { useMemo } from "react";
import type { Course } from "../../domain/types/catalog";
import { quizProgressKey } from "../../domain/types/quiz";
import {
  computeCoursePoints,
  PROJECT_POINTS_WEIGHT,
  projectProgressKey,
} from "../../domain/types/quizScore";
import {
  getAllProjectsForCourse,
  getAllQuizzesForCourse,
} from "../selectors/catalogSelectors";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

export function useCatalogPoints(courses: Course[]) {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  return useMemo(() => {
    let quizPoints = 0;
    let projectPoints = 0;
    let quizMax = 0;
    let projectMax = 0;

    for (const course of courses) {
      const quizzes = getAllQuizzesForCourse(course);
      const projects = getAllProjectsForCourse(course);

      const quizBestScores = quizzes.map(
        (quiz) =>
          quizByKey[quizProgressKey(course.id, quiz.id, quiz.lessonId)]?.bestScore ?? 0,
      );
      const projectStatuses = projects.map(
        (project) =>
          projectByKey[projectProgressKey(course.id, project.id, project.lessonId)]?.status ??
          "pending",
      );
      const points = computeCoursePoints({ quizBestScores, projectStatuses });
      quizPoints += points.quizPoints;
      projectPoints += points.projectPoints;
      quizMax += quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
      projectMax += projects.length * PROJECT_POINTS_WEIGHT;
    }

    return {
      quizPoints,
      projectPoints,
      totalPoints: quizPoints + projectPoints,
      quizMax,
      projectMax,
      totalMax: quizMax + projectMax,
    };
  }, [courses, projectByKey, quizByKey]);
}
