# Quiz schema reference

## File location

```text
course/<NN-module-slug>/quiz/<NN-quiz-slug>.json
```

Example: `course/01-javascript-fundamentals/quiz/01-fundamentals-check.json`

## JSON schema

```json
{
  "id": "01-fundamentals-check",
  "title": "Fundamentals Check",
  "description": "Optional one-line summary for the quiz list UI.",
  "questions": [
    {
      "id": "q1",
      "prompt": "Markdown supported. Use `code` and **bold**.",
      "options": [
        { "id": "a", "text": "First choice" },
        { "id": "b", "text": "Second choice" },
        { "id": "c", "text": "Third choice" }
      ],
      "correctOptionId": "a",
      "explanation": "Shown after the student clicks Check answer."
    }
  ]
}
```

## Validation rules

| Field | Rule |
|-------|------|
| `id` | Non-empty string; unique within the course module |
| `title` | Non-empty string |
| `description` | Optional string |
| `questions` | At least 1 question |
| `questions[].id` | Unique within the quiz |
| `questions[].prompt` | Non-empty; rendered as Markdown |
| `questions[].options` | Min 2; each needs `id` + `text` |
| `questions[].correctOptionId` | Must match an option `id` |
| `questions[].explanation` | Optional; Markdown |

Run validation:

```bash
node .cursor/skills/create-course-quiz/scripts/validate-quiz.mjs course/<module>/quiz/<file>.json
```

## Frontend integration

After adding or editing quiz files:

```bash
cd frontend && npm run catalog:generate
```

Quizzes appear under the course **Quiz** tab. URL pattern: `/course/:courseId?tab=quiz&quiz=:quizId`.

Types: `frontend/src/domain/types/quiz.ts`

## Question design guidelines

Align with module README and `examples/`:

1. **Test observable skills** from the module checklist — not trivia outside scope.
2. **Prefer predict-first** — “What is the result of …?” over vague definitions.
3. **One concept per question** — avoid compound prompts.
4. **Plausible distractors** — common misconceptions from README pitfalls.
5. **Explanations teach** — cite the rule of thumb; keep to 1–3 sentences.
6. **3–4 options** — use ids `a`, `b`, `c`, (`d` if needed).
7. **4–8 questions** per quiz for a module check; split into multiple quiz files if topics differ.

## Naming

| Item | Pattern | Example |
|------|---------|---------|
| Quiz file | `NN-kebab-slug.json` | `01-fundamentals-check.json` |
| Quiz `id` | Same as file base name | `01-fundamentals-check` |
| Question `id` | `q1`, `q2`, … | Sequential |

Do not duplicate an existing quiz `id` in the same module (check context script output).
