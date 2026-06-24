import { useMemo } from "react";
import type { Project } from "../../domain/types/catalog";
import type { Quiz } from "../../domain/types/quiz";
import {
  buildLessonActivityItems,
  type LessonActivityItem,
} from "../selectors/lessonProgress";
import { useProjectDeliveryStore } from "../stores/projectDeliveryStore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

/** Reactive lesson activity list that re-computes when progress stores change. */
export function useLessonActivityItems(input: {
  courseId: string;
  lessonId: string;
  quizzes: Quiz[];
  projects: Project[];
}): LessonActivityItem[] {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);
  const deliveriesByKey = useProjectDeliveryStore((s) => s.deliveriesByKey);

  return useMemo(
    () => buildLessonActivityItems(input),
    [
      input.courseId,
      input.lessonId,
      input.quizzes,
      input.projects,
      quizByKey,
      projectByKey,
      deliveriesByKey,
    ],
  );
}
