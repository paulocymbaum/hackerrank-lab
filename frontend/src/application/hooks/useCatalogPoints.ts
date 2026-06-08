import { useMemo } from "react";
import type { Course } from "../../domain/types/catalog";
import { quizProgressKey } from "../../domain/types/quiz";
import { computeCoursePoints, PROJECT_POINTS_WEIGHT, projectProgressKey } from "../../domain/types/quizScore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizSessionStore";

export function useCatalogPoints(courses: Course[]) {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  return useMemo(() => {
    let quizPoints = 0;
    let projectPoints = 0;
    let quizMax = 0;
    let projectMax = 0;

    for (const course of courses) {
      const quizBestScores = course.quizzes.map(
        (quiz) => quizByKey[quizProgressKey(course.id, quiz.id)]?.bestScore ?? 0,
      );
      const projectStatuses = course.projects.map(
        (project) => projectByKey[projectProgressKey(course.id, project.id)]?.status ?? "pending",
      );
      const points = computeCoursePoints({ quizBestScores, projectStatuses });
      quizPoints += points.quizPoints;
      projectPoints += points.projectPoints;
      quizMax += course.quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
      projectMax += course.projects.length * PROJECT_POINTS_WEIGHT;
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
