import { describe, expect, it } from "vitest";
import type { Course } from "../../domain/types/catalog";
import {
  getModuleLevelQuizzes,
  resolveActiveModulePageQuiz,
} from "./moduleSelectors";

const course: Course = {
  id: "javascript",
  title: "JavaScript",
  structure: "hierarchy",
  modules: [
    {
      id: "mod-1",
      title: "Fundamentals",
      lessons: [],
      projects: [],
      quizzes: [
        { id: "lesson-quiz", title: "Lesson Quiz", lessonId: "l1", path: "quiz/lesson.json", questions: [] },
        { id: "module-quiz", title: "Module Quiz", path: "quiz/module.json", questions: [] },
      ],
      readmeMarkdown: "",
      readmePath: "",
    },
  ],
  lessons: [],
  quizzes: [],
  projects: [],
  readmeMarkdown: "",
  readmePath: "",
};

describe("moduleSelectors", () => {
  it("getModuleLevelQuizzes excludes lesson-scoped quizzes", () => {
    const mod = course.modules![0];
    const quizzes = getModuleLevelQuizzes(mod);
    expect(quizzes.map((q) => q.id)).toEqual(["module-quiz"]);
  });

  it("resolveActiveModulePageQuiz accepts module-level quiz ids only", () => {
    expect(resolveActiveModulePageQuiz(course, "mod-1", "module-quiz")?.id).toBe("module-quiz");
    expect(resolveActiveModulePageQuiz(course, "mod-1", "lesson-quiz")).toBeNull();
    expect(resolveActiveModulePageQuiz(course, "mod-1", null)).toBeNull();
    expect(resolveActiveModulePageQuiz(course, "mod-1", "unknown")).toBeNull();
  });
});
