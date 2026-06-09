import type { Course } from "../../domain/types/catalog";
import { quizProgressKey } from "../../domain/types/quiz";
import { computeCoursePoints } from "../../domain/types/quizScore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizSessionStore";

export function computeCoursePointsForCourse(courseId: string, course: Course) {
  const quizBestScores = course.quizzes.map(
    (quiz) =>
      useQuizProgressStore.getState().getProgress(courseId, quiz.id, quiz.lessonId)?.bestScore ??
      0,
  );
  const projectStatuses = course.projects.map((project) =>
    useProjectProgressStore.getState().getStatus(courseId, project.id, project.lessonId),
  );

  return computeCoursePoints({ quizBestScores, projectStatuses });
}
