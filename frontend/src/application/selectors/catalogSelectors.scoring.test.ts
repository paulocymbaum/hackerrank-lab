import { describe, expect, it } from "vitest";
import type { Course } from "../../domain/types/catalog";
import {
  getAllProjectsForCourse,
  getAllQuizzesForCourse,
} from "./catalogSelectors";

describe("catalog scoring selectors", () => {
  const hierarchyCourse: Course = {
    id: "javascript",
    title: "JavaScript",
    readmePath: "course/javascript/README.md",
    readmeMarkdown: "",
    structure: "hierarchy",
    lessons: [],
    projects: [],
    quizzes: [],
    modules: [
      {
        id: "mod-1",
        title: "Module 1",
        readmePath: "course/javascript/modules/mod-1/README.md",
        readmeMarkdown: "",
        lessons: [],
        quizzes: [
          {
            id: "quiz-a",
            title: "Quiz A",
            path: "course/javascript/modules/mod-1/lessons/lesson-a/quiz/quiz.json",
            lessonId: "lesson-a",
            questions: [{ id: "q1", prompt: "?", options: [], correctOptionId: "o1" }],
          },
          {
            id: "quiz-b",
            title: "Quiz B",
            path: "course/javascript/modules/mod-1/quiz/quiz.json",
            questions: [
              { id: "q1", prompt: "?", options: [], correctOptionId: "o1" },
              { id: "q2", prompt: "?", options: [], correctOptionId: "o1" },
            ],
          },
        ],
        projects: [
          {
            id: "proj-a",
            title: "Project A",
            lessonId: "lesson-a",
            readmePath: "a/README.md",
            readmeMarkdown: "",
            rootPath: "a",
            entries: [],
          },
        ],
      },
    ],
  };

  it("flattens module quizzes for hierarchy courses", () => {
    expect(getAllQuizzesForCourse(hierarchyCourse).map((q) => q.id)).toEqual([
      "quiz-a",
      "quiz-b",
    ]);
  });

  it("flattens module projects for hierarchy courses", () => {
    expect(getAllProjectsForCourse(hierarchyCourse).map((p) => p.id)).toEqual(["proj-a"]);
  });

  it("uses root arrays for legacy courses", () => {
    const legacyCourse: Course = {
      id: "legacy",
      title: "Legacy",
      readmePath: "course/legacy/README.md",
      readmeMarkdown: "",
      structure: "legacy",
      lessons: [],
      modules: [],
      quizzes: [
        {
          id: "root-quiz",
          title: "Root Quiz",
          path: "course/legacy/quiz/quiz.json",
          questions: [{ id: "q1", prompt: "?", options: [], correctOptionId: "o1" }],
        },
      ],
      projects: [
        {
          id: "root-proj",
          title: "Root Project",
          readmePath: "p/README.md",
          readmeMarkdown: "",
          rootPath: "p",
          entries: [],
        },
      ],
    };

    expect(getAllQuizzesForCourse(legacyCourse)).toHaveLength(1);
    expect(getAllProjectsForCourse(legacyCourse)).toHaveLength(1);
  });
});
