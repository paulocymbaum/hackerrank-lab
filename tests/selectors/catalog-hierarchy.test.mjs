import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const catalog = JSON.parse(
  readFileSync(
    path.join(repoRoot, "frontend/src/infrastructure/static/catalog.json"),
    "utf8",
  ),
);

function getCourseById(courseId) {
  return catalog.courses.find((c) => c.id === courseId) ?? null;
}

function getModuleById(course, moduleId) {
  return course.modules?.find((m) => m.id === moduleId) ?? null;
}

function getLessonById(course, moduleId, lessonId) {
  return getModuleById(course, moduleId)?.lessons.find((l) => l.id === lessonId) ?? null;
}

function getProjectsForLesson(course, moduleId, lessonId) {
  const mod = getModuleById(course, moduleId);
  if (!mod) return [];
  return mod.projects.filter((p) => p.lessonId === lessonId);
}

describe("catalog hierarchy selectors", () => {
  const course = getCourseById("javascript");
  assert.ok(course, "javascript course must exist in catalog");

  it("getLessonById resolves truthy lesson", () => {
    const lesson = getLessonById(course, "01-javascript-fundamentals", "01.8.1-truthy-vs-falsy");
    assert.ok(lesson);
    assert.match(lesson.path, /01\.8\.1-truthy-vs-falsy/);
  });

  it("getProjectsForLesson scopes projects by lessonId", () => {
    const projects = getProjectsForLesson(
      course,
      "01-javascript-fundamentals",
      "01.8.1-truthy-vs-falsy",
    );
    assert.ok(projects.length >= 1);
    assert.ok(projects.every((p) => p.lessonId === "01.8.1-truthy-vs-falsy"));
  });
});
