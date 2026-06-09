import { describe, it } from "node:test";
import assert from "node:assert/strict";

function buildLessonUrl(courseId, moduleId, lessonId, params = {}) {
  const base = `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}/lesson/${encodeURIComponent(lessonId)}`;
  const search = new URLSearchParams();
  if (params.drawer) search.set("drawer", params.drawer);
  if (params.quiz) search.set("quiz", params.quiz);
  if (params.project) search.set("project", params.project);
  if (params.drawerTab) search.set("drawerTab", params.drawerTab);
  const query = search.toString();
  return query ? `${base}?${query}` : base;
}

function parseLessonDrawer(search) {
  const params = new URLSearchParams(search);
  return {
    drawer: params.get("drawer"),
    quiz: params.get("quiz"),
    project: params.get("project"),
    drawerTab: params.get("drawerTab"),
  };
}

describe("lesson workspace URL state", () => {
  it("round-trips quiz drawer params", () => {
    const url = buildLessonUrl("javascript", "01-javascript-fundamentals", "01.8.1-truthy-vs-falsy", {
      drawer: "quiz",
      quiz: "quiz-truthy-falsy",
    });
    const query = url.split("?")[1] ?? "";
    const parsed = parseLessonDrawer(query);
    assert.equal(parsed.drawer, "quiz");
    assert.equal(parsed.quiz, "quiz-truthy-falsy");
  });

  it("round-trips project drawer with delivery tab", () => {
    const url = buildLessonUrl("javascript", "01-javascript-fundamentals", "01.8.1-truthy-vs-falsy", {
      drawer: "project",
      project: "001-cli-input-validator",
      drawerTab: "delivery",
    });
    const query = url.split("?")[1] ?? "";
    const parsed = parseLessonDrawer(query);
    assert.equal(parsed.drawer, "project");
    assert.equal(parsed.project, "001-cli-input-validator");
    assert.equal(parsed.drawerTab, "delivery");
  });
});
