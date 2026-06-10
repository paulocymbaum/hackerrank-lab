import { useEffect } from "react";
import { syncQuizSessionFromUrl } from "./syncQuizSessionFromUrl";

export function useQuizSessionFromUrl(options: {
  quizId: string | null;
  lessonId?: string;
  enabled?: boolean;
  resetWhenDisabled?: boolean;
}) {
  const { quizId, lessonId, enabled = true, resetWhenDisabled = false } = options;

  useEffect(() => {
    syncQuizSessionFromUrl({ quizId, lessonId, enabled, resetWhenDisabled });
  }, [enabled, quizId, lessonId, resetWhenDisabled]);
}
