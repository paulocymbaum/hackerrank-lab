---
name: create-course-quiz
description: >-
  Creates and validates JSON quizzes for Hackerrank Study lessons under
  course/<course>/modules/<module>/lessons/<lesson>/quiz/. Collects lesson README
  as context, writes schema-compliant quiz files, and runs validation plus catalog:generate.
  Use when the user asks to create, add, or update a lesson quiz or assessment content.
---

# Create Lesson Quiz

## Quick start

1. **Collect source material** (always run first):

```bash
node .cursor/skills/create-course-quiz/scripts/collect-lesson-context.mjs 01.8.1-truthy-vs-falsy --course javascript --module 01-javascript-fundamentals
```

Use `--list` to see lesson ids.

2. **Draft the quiz JSON** from lesson README (see [reference.md](reference.md)).
3. **Write the file** to `course/javascript/modules/<module>/lessons/<lesson>/quiz/quiz.json`.
4. **Validate**:

```bash
node .cursor/skills/create-course-quiz/scripts/validate-quiz.mjs course/javascript/modules/01-javascript-fundamentals/lessons/01.8.1-truthy-vs-falsy/quiz/quiz.json
```

5. **Regenerate catalog**:

```bash
cd frontend && npm run catalog:generate
```

## Workflow checklist

```
- [ ] collect-lesson-context.mjs run for target lesson
- [ ] No duplicate quiz id
- [ ] Questions cover lesson predict-first / pitfalls only
- [ ] Each question has explanation
- [ ] quiz JSON includes lessonId and graphIndex
- [ ] validate-quiz.mjs passes
- [ ] catalog:generate run
```

## Question quality

- Source truth: lesson **README.md** only (not whole module).
- Distractors = realistic mistakes from the lesson.
- Do **not** invent topics outside the lesson graph node.

## Scripts

| Script | Purpose |
|--------|---------|
| [scripts/collect-lesson-context.mjs](scripts/collect-lesson-context.mjs) | Lesson README + prerequisites + existing quizzes |
| [scripts/collect-course-context.mjs](scripts/collect-course-context.mjs) | Legacy module-level context |
| [scripts/validate-quiz.mjs](scripts/validate-quiz.mjs) | Schema validation |

## Output location (canonical)

```text
course/<course>/modules/<module>/lessons/<lesson>/quiz/quiz.json
```

Legacy module quizzes remain at `course/<NN-module>/quiz/*.json` until migrated.

## Additional resources

- Full schema: [reference.md](reference.md)
- Examples: [examples.md](examples.md)
- Hierarchy contract: `.cursor/rules/course-hierarchy.mdc`
