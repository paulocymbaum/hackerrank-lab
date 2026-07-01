import { describe, expect, it } from "vitest";
import {
  buildGenerateLessonPrompt,
  buildLessonProjectPrompt,
  buildLessonQuizPrompt,
  buildLessonSocraticPrompt,
  type ContentMapSkillPromptContext,
} from "./contentMapSkillPrompts";

const existingLessonCtx: ContentMapSkillPromptContext = {
  courseSlug: "javascript",
  graphIndex: "01.8.1",
  label: "Truthy vs Falsy",
  catalogRef: {
    courseId: "javascript",
    moduleId: "01-javascript-fundamentals",
    lessonId: "01.8.1-truthy-vs-falsy",
  },
};

const plannedLessonCtx: ContentMapSkillPromptContext = {
  courseSlug: "javascript",
  graphIndex: "01.8.4",
  label: "Nullish Coalescing",
};

describe("contentMapSkillPrompts", () => {
  it("buildLessonSocraticPrompt includes skill name and lesson identifiers", () => {
    const prompt = buildLessonSocraticPrompt(existingLessonCtx);
    expect(prompt).toContain("teacher-socratic");
    expect(prompt).toContain("01.8.1");
    expect(prompt).toContain("Truthy vs Falsy");
    expect(prompt).toContain("01.8.1-truthy-vs-falsy");
    expect(prompt).toContain("01-javascript-fundamentals");
  });

  it("buildLessonQuizPrompt includes skill name and collect command", () => {
    const prompt = buildLessonQuizPrompt(existingLessonCtx);
    expect(prompt).toContain("create-course-quiz");
    expect(prompt).toContain("01.8.1");
    expect(prompt).toContain("collect-lesson-context.mjs");
    expect(prompt).toContain("01.8.1-truthy-vs-falsy");
    expect(prompt).toContain("--module 01-javascript-fundamentals");
  });

  it("buildLessonProjectPrompt includes skill name and collect command", () => {
    const prompt = buildLessonProjectPrompt(existingLessonCtx);
    expect(prompt).toContain("create-course-project");
    expect(prompt).toContain("01.8.1");
    expect(prompt).toContain("collect-project-context.mjs");
    expect(prompt).toContain("--lesson 01.8.1-truthy-vs-falsy");
  });

  it("buildGenerateLessonPrompt includes skill name and graph index", () => {
    const prompt = buildGenerateLessonPrompt(plannedLessonCtx);
    expect(prompt).toContain("generate-lesson-teacher");
    expect(prompt).toContain("01.8.4");
    expect(prompt).toContain("Nullish Coalescing");
    expect(prompt).toContain('scaffold-from-graph.mjs "01.8.4"');
    expect(prompt).not.toContain("catalogRef");
  });

  it("throws when catalogRef is missing for existing lesson prompts", () => {
    expect(() => buildLessonSocraticPrompt(plannedLessonCtx)).toThrow(/catalogRef/);
    expect(() => buildLessonQuizPrompt(plannedLessonCtx)).toThrow(/catalogRef/);
    expect(() => buildLessonProjectPrompt(plannedLessonCtx)).toThrow(/catalogRef/);
  });
});
