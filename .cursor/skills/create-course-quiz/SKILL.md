---
name: create-course-quiz
description: >-
  Creates and validates JSON quizzes for Hackerrank Study course modules under
  course/<module>/quiz/. Collects module README and example lessons as context,
  writes schema-compliant quiz files, and runs validation plus catalog:generate.
  Use when the user asks to create, add, or update a course quiz, quiz questions,
  or assessment content for a module.
---

# Create Course Quiz

## Quick start

1. **Collect source material** (always run first):

```bash
node .cursor/skills/create-course-quiz/scripts/collect-course-context.mjs <course-id>
```

Use `--list` to see course ids. Example id: `01-javascript-fundamentals`.

2. **Draft the quiz JSON** from README + examples (see [reference.md](reference.md)).
3. **Write the file** to `course/<course-id>/quiz/<NN-slug>.json`.
4. **Validate**:

```bash
node .cursor/skills/create-course-quiz/scripts/validate-quiz.mjs course/<course-id>/quiz/<NN-slug>.json
```

5. **Regenerate catalog**:

```bash
cd frontend && npm run catalog:generate
```

## Workflow checklist

```
- [ ] collect-course-context.mjs run for target module
- [ ] No duplicate quiz id (check Existing quizzes section)
- [ ] Questions cover module checklist / example topics
- [ ] Each question has explanation
- [ ] validate-quiz.mjs passes
- [ ] catalog:generate run (report quiz count)
```

## Question quality

- Source truth: module **README** (terms, pitfalls, checklist) and **examples/** (predict-first exercises).
- Distractors = realistic mistakes documented in the module.
- Prompts may use Markdown and inline `` `code` `` (same renderer as lessons).
- Do **not** invent topics outside the module scope.

## Scripts

| Script | Purpose |
|--------|---------|
| [scripts/collect-course-context.mjs](scripts/collect-course-context.mjs) | README + examples + existing quizzes |
| [scripts/validate-quiz.mjs](scripts/validate-quiz.mjs) | Schema validation |

### collect-course-context.mjs flags

- `--list` — print course folder ids
- `--format json|markdown` (default: markdown)
- `--out <path>` — write to file instead of stdout
- `--keep-markers` — retain `<!-- cursor:... -->` HTML comments

### validate-quiz.mjs

Accepts one or more quiz file paths. Exit code `1` on failure.

## Output location

```text
course/<NN-module-slug>/quiz/<NN-quiz-slug>.json
```

File base name should match quiz `id` (e.g. `01-fundamentals-check.json` → `"id": "01-fundamentals-check"`).

## Additional resources

- Full schema and design rules: [reference.md](reference.md)
- Command examples: [examples.md](examples.md)
- Repo quiz UI types: `frontend/src/domain/types/quiz.ts`
- PBL projects (parallel skill): `.cursor/skills/create-course-project/SKILL.md`
- Content contract for modules/lessons: `.cursor/rules/course-and-lesson-content.mdc`
