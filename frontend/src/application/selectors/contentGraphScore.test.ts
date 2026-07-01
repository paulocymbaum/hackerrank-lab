import { describe, expect, it } from "vitest";
import type { Course } from "../../domain/types/catalog";
import type { ContentGraphNode } from "../../domain/types/contentGraph";
import { buildContentGraphScores, mergeNodeScores } from "./contentGraphScore";

const mockCourse: Course = {
  id: "javascript",
  title: "JavaScript",
  readmePath: "",
  readmeMarkdown: "",
  structure: "hierarchy",
  modules: [
    {
      id: "01-javascript-fundamentals",
      title: "Fundamentals",
      graphIndex: "01",
      readmePath: "",
      readmeMarkdown: "",
      lessons: [{ id: "01.1.1-lesson", title: "Lesson", path: "", markdown: "", graphIndex: "01.1.1" }],
      projects: [
        {
          id: "001-project",
          title: "Project",
          rootPath: "",
          readmePath: "",
          readmeMarkdown: "",
          entries: [],
          moduleId: "01-javascript-fundamentals",
          lessonId: "01.1.1-lesson",
        },
      ],
      quizzes: [
        {
          id: "quiz-1",
          title: "Quiz",
          path: "course/javascript/quiz/quiz-1.json",
          questions: [{ id: "q1", prompt: "?", options: [], correctOptionId: "a" }],
          lessonId: "01.1.1-lesson",
        },
      ],
    },
  ],
  lessons: [],
  projects: [],
  quizzes: [],
};

const lessonNode: ContentGraphNode = {
  id: "lesson-1",
  graphIndex: "01.1.1",
  label: "Running JavaScript",
  kind: "lesson",
  children: [],
  status: "exists",
  catalogRef: {
    courseId: "javascript",
    moduleId: "01-javascript-fundamentals",
    lessonId: "01.1.1-lesson",
  },
};

const sectionNode: ContentGraphNode = {
  id: "section-1",
  graphIndex: "01.1",
  label: "Getting Started",
  kind: "section",
  children: [lessonNode],
};

describe("buildContentGraphScores", () => {
  it("computes lesson score from progress stores snapshot", () => {
    const scores = buildContentGraphScores(sectionNode, [mockCourse], {
      quizByKey: { "javascript:quiz:01.1.1-lesson:quiz-1": { bestScore: 1 } },
      projectByKey: { "javascript:project:01.1.1-lesson:001-project": { status: "done" } },
    });

    const lessonScore = scores.get("lesson-1");
    expect(lessonScore).toEqual({
      points: { value: 5, max: 5 },
      activities: { done: 2, total: 2 },
    });

    const sectionScore = scores.get("section-1");
    expect(sectionScore).toEqual(lessonScore);
  });

  it("returns null score for planned lessons", () => {
    const planned: ContentGraphNode = {
      ...lessonNode,
      id: "planned-1",
      status: "planned",
      catalogRef: undefined,
    };
    const scores = buildContentGraphScores(planned, [mockCourse], {
      quizByKey: {},
      projectByKey: {},
    });
    expect(scores.has("planned-1")).toBe(false);
  });

  it("returns zero score for exists lesson without activities", () => {
    const lessonOnlyCourse: Course = {
      ...mockCourse,
      modules: [
        {
          ...mockCourse.modules![0],
          quizzes: [],
          projects: [],
        },
      ],
    };
    const scores = buildContentGraphScores(sectionNode, [lessonOnlyCourse], {
      quizByKey: {},
      projectByKey: {},
    });
    expect(scores.get("lesson-1")).toEqual({
      points: { value: 0, max: 0 },
      activities: { done: 0, total: 0 },
    });
  });
});

describe("mergeNodeScores", () => {
  it("sums points and activities", () => {
    const merged = mergeNodeScores([
      { points: { value: 3, max: 5 }, activities: { done: 1, total: 2 } },
      { points: { value: 2, max: 4 }, activities: { done: 1, total: 1 } },
    ]);
    expect(merged).toEqual({
      points: { value: 5, max: 9 },
      activities: { done: 2, total: 3 },
    });
  });
});
