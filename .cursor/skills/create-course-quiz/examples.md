# Examples

## List available courses

```bash
node .cursor/skills/create-course-quiz/scripts/collect-course-context.mjs --list
```

```
01-javascript-fundamentals
02-objects-references-and-copying
03-asynchronous-javascript-runtime-model-event-loop
```

## Collect context (markdown, default)

```bash
node .cursor/skills/create-course-quiz/scripts/collect-course-context.mjs 01-javascript-fundamentals
```

Output sections: **README**, **Examples** (full markdown per file), **Existing quizzes**.

## Collect context (JSON, for tooling)

```bash
node .cursor/skills/create-course-quiz/scripts/collect-course-context.mjs \
  02-objects-references-and-copying \
  --format json \
  --out /tmp/course-context.json
```

## Validate before commit

```bash
node .cursor/skills/create-course-quiz/scripts/validate-quiz.mjs \
  course/01-javascript-fundamentals/quiz/01-fundamentals-check.json
```

```
OK  course/01-javascript-fundamentals/quiz/01-fundamentals-check.json (4 questions, id=01-fundamentals-check)
```

## Regenerate frontend catalog

```bash
cd frontend && npm run catalog:generate
```

## Sample question (from existing quiz)

```json
{
  "id": "q2",
  "prompt": "What is the result of `null == undefined`?",
  "options": [
    { "id": "a", "text": "true" },
    { "id": "b", "text": "false" },
    { "id": "c", "text": "TypeError" }
  ],
  "correctOptionId": "a",
  "explanation": "Loose equality treats null and undefined as equal. Strict equality (`===`) would be false."
}
```
