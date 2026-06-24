import { test } from "node:test";
import assert from "node:assert/strict";
import {
  countLessonConceptItems,
  extractObserveLines,
  isLessonSkeleton,
  validateLessonProjectAlignment,
  validateProjectReadme,
} from "../../.cursor/skills/create-course-project/scripts/project-contract.mjs";

const strongLesson = `# Truthy vs Falsy

## Predict first
What is truthy?

## What to observe
- Only false, 0, "", null, undefined, NaN are falsy
- "0" is truthy
- Use Boolean() for explicit conversion

## Quick challenge
`;

const strongProject = `# Truthy Classifier

## Problem context
Context

## Goal
Classify values

## Lesson concepts practiced
- [ ] Only false, 0, "", null, undefined, NaN are falsy
- [ ] "0" is truthy

## Functional requirements
- [ ] Use Boolean()

## Non-functional requirements
- [ ] Clear output

## Constraints
- [ ] Node only

## Acceptance criteria
- [ ] 0 is falsy
- [ ] "0" is truthy

## Suggested plan (no solution)
1. Implement

## Deliverables
- [ ] Code in starter/
`;

const weakLesson = strongLesson;

const weakProject = `# CLI Validator

## Problem context
Context

## Goal
Validate

## Lesson concepts practiced
- [ ] Parse numbers
- [ ] Reject empty strings

## Functional requirements
- [ ] No truthiness checks

## Non-functional requirements
- [ ] Clear errors

## Constraints
- [ ] No truthiness checks for numeric fields

## Acceptance criteria
- [ ] age 0 accepted

## Suggested plan (no solution)
1. Parse

## Deliverables
- [ ] Code in starter/
`;

const skeletonLesson = `# Event Loop

## Context

## Predict first

## Explanation
`;

test("extractObserveLines pulls bullet lines", () => {
  const lines = extractObserveLines(strongLesson);
  assert.ok(lines.length >= 2);
  assert.ok(lines.some((l) => l.includes("falsy")));
});

test("isLessonSkeleton detects empty lesson", () => {
  assert.equal(isLessonSkeleton(skeletonLesson), true);
  assert.equal(isLessonSkeleton(strongLesson), false);
});

test("validateProjectReadme requires Lesson concepts practiced", () => {
  const missing = validateProjectReadme(strongProject.replace(/## Lesson concepts practiced[\s\S]*?## Functional/, "## Functional"));
  assert.ok(missing.errors.some((e) => e.includes("Lesson concepts practiced")));
});

test("validateLessonProjectAlignment passes strong pair", () => {
  const result = validateLessonProjectAlignment(strongLesson, strongProject);
  assert.equal(result.errors.length, 0);
});

test("validateLessonProjectAlignment fails inverted truthiness project", () => {
  const result = validateLessonProjectAlignment(weakLesson, weakProject);
  assert.ok(result.errors.some((e) => e.includes("truthiness")));
});

test("countLessonConceptItems counts checkboxes", () => {
  assert.equal(countLessonConceptItems(strongProject), 2);
});
