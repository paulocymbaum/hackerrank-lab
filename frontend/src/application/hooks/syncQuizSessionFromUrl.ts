import { quizSessionKey } from "../selectors/quizSelectors";
import { useQuizSessionStore } from "../stores/quizSessionStore";

export function syncQuizSessionFromUrl(options: {
  quizId: string | null;
  lessonId?: string;
  enabled?: boolean;
  resetWhenDisabled?: boolean;
}): void {
  const { quizId, lessonId, enabled = true, resetWhenDisabled = false } = options;

  if (!enabled || !quizId) {
    if (resetWhenDisabled && useQuizSessionStore.getState().quizId) {
      useQuizSessionStore.getState().reset();
    }
    return;
  }

  const session = useQuizSessionStore.getState();
  const nextKey = quizSessionKey(quizId, lessonId);
  if (session.sessionKey !== nextKey) {
    session.start(quizId, lessonId);
  }
}
