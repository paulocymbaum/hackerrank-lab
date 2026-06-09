import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isValidCourseId, isValidProjectRootPath } from "../../frontend/scripts/api-validation.mjs";

describe("quiz-score plugin validation", () => {
  it("accepts hierarchy course slug javascript", () => {
    assert.equal(isValidCourseId("javascript"), true);
  });

  it("accepts legacy module id", () => {
    assert.equal(isValidCourseId("01-javascript-fundamentals"), true);
  });

  it("rejects path traversal in course id", () => {
    assert.equal(isValidCourseId(".."), false);
    assert.equal(isValidCourseId(""), false);
  });
});

describe("project root path validation", () => {
  it("accepts hierarchy lesson project path", () => {
    const rootPath =
      "course/javascript/modules/01-javascript-fundamentals/lessons/01.8.1-truthy-vs-falsy/projects/001-cli-input-validator";
    assert.equal(isValidProjectRootPath("javascript", rootPath), true);
  });

  it("accepts legacy flat project path", () => {
    const rootPath = "course/01-javascript-fundamentals/projects/topic/001-cli-input-validator";
    assert.equal(isValidProjectRootPath("01-javascript-fundamentals", rootPath), true);
  });

  it("rejects path traversal", () => {
    assert.equal(
      isValidProjectRootPath("javascript", "course/javascript/../secrets/projects/x"),
      false,
    );
  });

  it("rejects paths without projects segment", () => {
    assert.equal(
      isValidProjectRootPath("javascript", "course/javascript/modules/01-javascript-fundamentals"),
      false,
    );
  });
});
