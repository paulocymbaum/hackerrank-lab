import { beforeEach, describe, expect, it } from "vitest";
import { useQuizSessionStore } from "../stores/quizSessionStore";
import { syncQuizSessionFromUrl } from "./syncQuizSessionFromUrl";

describe("syncQuizSessionFromUrl", () => {
  beforeEach(() => {
    useQuizSessionStore.getState().reset();
  });

  it("starts session when quiz id is provided", () => {
    syncQuizSessionFromUrl({ quizId: "quiz-1", lessonId: "lesson-1", enabled: true });

    const session = useQuizSessionStore.getState();
    expect(session.quizId).toBe("quiz-1");
    expect(session.lessonId).toBe("lesson-1");
  });

  it("resets session when disabled and resetWhenDisabled is true", () => {
    syncQuizSessionFromUrl({ quizId: "quiz-1", enabled: true });
    syncQuizSessionFromUrl({ quizId: null, enabled: false, resetWhenDisabled: true });

    expect(useQuizSessionStore.getState().quizId).toBeNull();
  });
});
