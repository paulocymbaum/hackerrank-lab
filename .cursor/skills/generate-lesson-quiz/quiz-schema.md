# Quiz JSON schema (reference)

## Top-level fields

| Field | Required | Description |
|-------|----------|-------------|
| `marker` | yes | Always `"cursor:teacher:add-lesson-quiz"` |
| `moduleId` | yes | Module folder name, e.g. `01-javascript-fundamentals` |
| `lessonPath` | yes | POSIX path from repo root to the lesson `.md` |
| `title` | yes | Human title, e.g. `"Truthy vs Falsy — Quiz"` |
| `activities` | yes | Array of **5–10** activity objects |

## Activity fields (common)

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | `q01` … `q10` |
| `type` | yes | See SKILL.md allowed types |
| `tier` | recommended | `1`, `2`, or `3` when module uses tiers |
| `prompt` | yes | Question text |
| `code` | optional | JavaScript snippet |
| `choices` | type-dependent | String array for selection types |
| `answer` | yes | See per-type formats below |
| `explanation` | yes | Short rationale after answering |

## Answer formats by type

| `type` | `answer` format | `choices` |
|--------|-----------------|-----------|
| `predict_output` | string (exact output) | required |
| `order_output` | string[] (labels in order) | required (same items, shuffled in UI) |
| `stack_trace` | string (top frame name or step label) | required |
| `multiple_choice` | string (must match one choice) | required (3–5 items) |
| `true_false` | boolean | omit |
| `match_terms` | object `{ "term": "definition", ... }` | omit |
| `spot_bug` | string (best fix option) | required |

## Example file

`course/01-javascript-fundamentals/quiz/01-truthy-falsy.quiz.json`:

```json
{
  "marker": "cursor:teacher:add-lesson-quiz",
  "moduleId": "01-javascript-fundamentals",
  "lessonPath": "course/01-javascript-fundamentals/examples/01-truthy-falsy.md",
  "title": "Truthy vs Falsy — Quiz",
  "activities": [
    {
      "id": "q01",
      "type": "predict_output",
      "tier": 1,
      "prompt": "What does this print?",
      "code": "console.log(Boolean(\"0\"));",
      "choices": ["true", "false"],
      "answer": "true",
      "explanation": "Any non-empty string is truthy, including the character \"0\"."
    },
    {
      "id": "q02",
      "type": "predict_output",
      "tier": 1,
      "prompt": "What does this print?",
      "code": "console.log(Boolean(0));",
      "choices": ["true", "false"],
      "answer": "false",
      "explanation": "0 is one of the seven falsy values."
    },
    {
      "id": "q03",
      "type": "true_false",
      "tier": 1,
      "prompt": "An empty array `[]` is falsy.",
      "answer": false,
      "explanation": "Objects (including arrays) are always truthy in boolean context."
    },
    {
      "id": "q04",
      "type": "multiple_choice",
      "tier": 1,
      "prompt": "Which value is falsy?",
      "choices": ["\"0\"", "[]", "NaN", "{}"],
      "answer": "NaN",
      "explanation": "Only false, 0, -0, 0n, \"\", null, undefined, and NaN are falsy."
    },
    {
      "id": "q05",
      "type": "spot_bug",
      "tier": 2,
      "prompt": "This validation treats a valid age as missing. Which check is the bug?",
      "code": "const age = 0;\nif (!age) {\n  throw new Error(\"age required\");\n}",
      "choices": [
        "Use `age == null` instead of `!age`",
        "Use `age === \"\"`",
        "Use `typeof age === \"undefined\"` only",
        "Use `Number.isNaN(age)`"
      ],
      "answer": "Use `age == null` instead of `!age`",
      "explanation": "0 is falsy but often valid; nullish checks distinguish missing from zero."
    },
    {
      "id": "q06",
      "type": "match_terms",
      "tier": 1,
      "prompt": "Match each term to its definition.",
      "answer": {
        "Truthy": "Passes `if (value)` as true",
        "Falsy": "Passes `if (value)` as false",
        "ToBoolean": "Internal conversion used in boolean contexts"
      },
      "explanation": "Truthy/falsy describe boolean context behavior, not validity of data."
    }
  ]
}
```
