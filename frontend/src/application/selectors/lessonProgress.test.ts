import { describe, expect, it } from "vitest";
import { computeLessonProgress, type LessonActivityItem } from "./lessonProgress";

describe("computeLessonProgress", () => {
  it("counts done items", () => {
    const items: LessonActivityItem[] = [
      {
        id: "q1",
        kind: "quiz",
        title: "Quiz",
        done: true,
        statusLabel: "Best 100%",
      },
      {
        id: "p1",
        kind: "project",
        title: "Project",
        done: false,
        statusLabel: "Not started",
      },
    ];

    expect(computeLessonProgress(items)).toEqual({ done: 1, total: 2 });
  });

  it("returns zero total for empty list", () => {
    expect(computeLessonProgress([])).toEqual({ done: 0, total: 0 });
  });
});
