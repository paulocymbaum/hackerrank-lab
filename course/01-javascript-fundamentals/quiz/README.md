# Quiz files (`quiz/*.json`)

Each course module can include multiple quiz JSON files in this folder. They are embedded into `catalog.json` when you run:

```bash
npm run catalog:generate
```

## Schema

```json
{
  "id": "01-fundamentals-check",
  "title": "Fundamentals Check",
  "description": "Optional short description shown in the quiz list.",
  "questions": [
    {
      "id": "q1",
      "prompt": "Question text. Supports **Markdown**.",
      "options": [
        { "id": "a", "text": "First option" },
        { "id": "b", "text": "Second option" }
      ],
      "correctOptionId": "a",
      "explanation": "Optional feedback after the student checks the answer."
    }
  ]
}
```

## Rules

- File name: `NN-slug.json` (kebab-case, optional numeric prefix for ordering).
- `id` must be unique within the course module.
- At least **2 options** per question; `correctOptionId` must match one option `id`.
- `prompt` and `explanation` are rendered with the same Markdown viewer as lessons.

## UI flow

- Course tab **Quiz** → list of quizzes with best score (stored in browser localStorage).
- **Start** → `/course/:courseId?tab=quiz&quiz=:quizId` — one question at a time, check answer, explanation, next/finish.
