import { useMemo } from "react";
import type { Course } from "../../domain/types/catalog";
import type { ContentGraphNode } from "../../domain/types/contentGraph";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";
import { buildContentGraphScores } from "../selectors/contentGraphScore";

export function useContentGraphScores(root: ContentGraphNode | null, courses: Course[]) {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  return useMemo(() => {
    if (!root) return new Map();
    return buildContentGraphScores(root, courses, { quizByKey, projectByKey });
  }, [root, courses, quizByKey, projectByKey]);
}
