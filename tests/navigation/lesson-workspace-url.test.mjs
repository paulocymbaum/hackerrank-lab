import { describe, it } from "node:test";
import assert from "node:assert/strict";

function lessonQuizPath(courseId, moduleId, lessonId, quizId) {
  return `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}/lesson/${encodeURIComponent(lessonId)}/quiz/${encodeURIComponent(quizId)}`;
}

function lessonProjectPath(courseId, moduleId, lessonId, projectId, tab) {
  const base = `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}/lesson/${encodeURIComponent(lessonId)}/project/${encodeURIComponent(projectId)}`;
  if (!tab || tab === "files") return base;
  return `${base}?tab=${encodeURIComponent(tab)}`;
}

function moduleQuizPath(courseId, moduleId, quizId) {
  return `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}/quiz/${encodeURIComponent(quizId)}`;
}

function parseProjectTab(search) {
  const tab = new URLSearchParams(search).get("tab");
  if (tab === "delivery") return "delivery";
  return "files";
}

describe("activity routes", () => {
  it("builds lesson quiz path", () => {
    const url = lessonQuizPath(
      "javascript",
      "01-javascript-fundamentals",
      "01.8.1-truthy-vs-falsy",
      "quiz-truthy-falsy",
    );
    assert.equal(
      url,
      "/course/javascript/module/01-javascript-fundamentals/lesson/01.8.1-truthy-vs-falsy/quiz/quiz-truthy-falsy",
    );
  });

  it("builds lesson project path with delivery tab", () => {
    const url = lessonProjectPath(
      "javascript",
      "01-javascript-fundamentals",
      "01.8.1-truthy-vs-falsy",
      "001-cli-input-validator",
      "delivery",
    );
    assert.equal(
      url.split("?")[0],
      "/course/javascript/module/01-javascript-fundamentals/lesson/01.8.1-truthy-vs-falsy/project/001-cli-input-validator",
    );
    assert.equal(parseProjectTab(url.split("?")[1] ?? ""), "delivery");
  });

  it("builds module quiz path", () => {
    const url = moduleQuizPath("javascript", "01-javascript-fundamentals", "01-fundamentals-check");
    assert.equal(
      url,
      "/course/javascript/module/01-javascript-fundamentals/quiz/01-fundamentals-check",
    );
  });
});
