---
name: generate-lesson-quiz
description: >-
  Generates 5–10 quiz activities per course lesson (module README or examples/*.md)
  aligned with stack-first, tiered, and predict-first lesson structure. Use when the
  user asks for quizzes, quiz activities, assessments, or practice questions for a
  lesson or module in course/.
disable-model-invocation: true
---

# Generate Lesson Quizzes (5–10 activities)

Create **one quiz file per lesson** under `course/<module>/quiz/`, with **5–10 activities** that reinforce the same mental models as the lesson contract (`.cursor/rules/course-and-lesson-content.mdc`).

## What counts as a “lesson”

| Lesson source | Path pattern | Quiz output file |
|---------------|--------------|------------------|
| Example lesson | `course/<module>/examples/NN-*.md` | `course/<module>/quiz/NN-*.quiz.json` |
| Module overview | `course/<module>/README.md` | `course/<module>/quiz/00-module-overview.quiz.json` |

Match the example basename (`01-truthy-falsy.md` → `01-truthy-falsy.quiz.json`).

## Before generating

1. Read the lesson markdown (and module `README.md` for tier/scope context).
2. Confirm the module exists and has `.cursor-created.json` (teacher scaffold).
3. List existing quizzes to avoid duplicates:

```bash
node .cursor/tools/teacher/check-lessons.js
ls course/<module>/quiz/ 2>/dev/null || true
```

## Activity mix (5–10 total)

Pick a count between **5 and 10** based on lesson depth (shorter example → 5–6; full module README → 8–10).

**Required distribution:**

| Requirement | Count | Notes |
|-------------|-------|--------|
| Predict-first | **≥ 2** | `predict_output`, `stack_trace`, or `order_output` |
| Concept check | **≥ 2** | `multiple_choice` or `true_false` |
| Pitfall / bug class | **≥ 1** | `spot_bug` or MCQ tied to “why this matters” |
| Terminology | **≥ 1** | `match_terms` or MCQ on key terms |

**When the lesson is runtime/async/stack-related**, include **≥ 1** `stack_trace` or `order_output` that separates **call stack** (sync frames) from **scheduling** (microtasks vs tasks). Do not conflate them in explanations.

**Tier alignment** (when the module README has Tier 1/2/3):

- Tag each activity with `"tier": 1 | 2 | 3`.
- Include at least **one activity per tier present** in the lesson/module.
- Prefer harder types (`order_output`, `stack_trace`, `spot_bug`) in higher tiers.

## Allowed activity types

| `type` | Use for |
|--------|---------|
| `predict_output` | Small snippet; learner picks printed result |
| `order_output` | Order of `console.log` / async scheduling |
| `stack_trace` | Which frame is on top, or PUSH/POP at a line |
| `multiple_choice` | Rules, definitions, best practice |
| `true_false` | Quick misconceptions |
| `match_terms` | Term ↔ definition (3–5 pairs) |
| `spot_bug` | Short code with one intentional bug; pick fix |

## JSON contract (write exactly this shape)

See [quiz-schema.md](quiz-schema.md) for field details and a full example.

Minimal top-level object:

```json
{
  "marker": "cursor:teacher:add-lesson-quiz",
  "moduleId": "01-javascript-fundamentals",
  "lessonPath": "course/01-javascript-fundamentals/examples/01-truthy-falsy.md",
  "title": "Truthy vs Falsy — Quiz",
  "activities": []
}
```

Each activity:

```json
{
  "id": "q01",
  "type": "predict_output",
  "tier": 1,
  "prompt": "What prints?",
  "code": "console.log(Boolean(\"0\"));",
  "choices": ["true", "false"],
  "answer": "true",
  "explanation": "Non-empty strings are truthy, including \"0\"."
}
```

**Rules:**

- `id`: `q01` … `q10`, unique within the file.
- `prompt`: one clear question; no trick wording unless teaching pitfalls.
- `code`: optional; keep snippets ≤ 12 lines.
- `choices`: required for `predict_output`, `multiple_choice`, `order_output`, `spot_bug`; omit for `true_false` and `match_terms`.
- `answer`: string, boolean, array of strings (for `order_output` / `match_terms`), or index for MCQ.
- `explanation`: 1–3 sentences; cite the lesson rule, not spec trivia.

## Authoring workflow

1. **Extract** from the lesson: falsy list, rules of thumb, predict-first snippets, pitfalls, tier labels.
2. **Draft** 8 activities, then **trim or add** to land between 5–10.
3. **Validate** distractors: plausible, mutually exclusive, one correct answer.
4. **Write** JSON to stdin and run the tool:

```bash
mkdir -p course/<module>/quiz
cat quiz.json | node .cursor/tools/teacher/add-lesson-quiz.js <moduleDir> examples/01-truthy-falsy.md
```

For module overview quiz:

```bash
cat quiz.json | node .cursor/tools/teacher/add-lesson-quiz.js <moduleDir> README.md
```

5. Tool writes `course/<module>/quiz/<basename>.quiz.json` and refuses duplicate markers.

## Quality checklist

- [ ] 5–10 activities, unique `id`s
- [ ] ≥ 2 predict-first style activities
- [ ] Every activity maps to content **in scope** for that lesson
- [ ] No duplicate of module self-test prompts (vary snippets or angle)
- [ ] Explanations reinforce mental models, not memorized trivia
- [ ] Async lessons: stack vs scheduling language is consistent
- [ ] JSON parses; `lessonPath` matches the source file

## Batch: all example lessons in a module

For each `course/<module>/examples/*.md`:

1. Read the file.
2. Generate 5–8 activities (examples are narrower than module README).
3. Run `add-lesson-quiz.js` once per file.

Module `README.md` quiz: 8–10 activities spanning all tiers + stack-first section.

## Related skills

- Lesson content: `generate-lesson-teacher`
- Interactive tutoring: `teacher-socratic` (do not dump full quiz answers in chat unless the user asks)

## One-shot prompt (copy/paste)

```text
Generate a quiz JSON file for this repo lesson.

Source lesson path: <course/.../examples/NN-name.md or README.md>
Module id: <01-...>
Activity count: <5-10>

Hard requirements:
- Follow .cursor/skills/generate-lesson-quiz/SKILL.md activity mix and types.
- Align with stack-first / tiered / predict-first structure from the lesson.
- Output ONLY valid JSON matching the skill schema (no markdown wrapper).
- Include marker, moduleId, lessonPath, title, activities[].

Read the lesson file first, then write the quiz.
```
