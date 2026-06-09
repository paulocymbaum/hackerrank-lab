# Project delivery review schema

## File: `project-delivery.json`

Version **2** (version 1 files remain valid; reviews are optional).

```json
{
  "version": 2,
  "courseId": "01-javascript-fundamentals",
  "projectId": "001-cli-input-validator",
  "updatedAt": "2026-06-09T12:00:00.000Z",
  "deliveries": [
    {
      "id": "2026-06-09T00:00:11.449Z",
      "content": "First attempt write-up…",
      "submittedAt": "2026-06-09T00:00:11.449Z"
    },
    {
      "id": "2026-06-09T00:00:19.245Z",
      "content": "Latest delivery…",
      "submittedAt": "2026-06-09T00:00:19.245Z",
      "review": {
        "score": 85,
        "comment": "Meets acceptance criteria. Good explicit validation.",
        "reviewedAt": "2026-06-09T12:00:00.000Z"
      }
    }
  ]
}
```

## Review fields

| Field | Rule |
|-------|------|
| `review.score` | Integer **0–100** |
| `review.comment` | Non-empty string (Markdown allowed) |
| `review.reviewedAt` | ISO timestamp |

## Pass rule

- **Pass**: `score > 80`
- On pass, project status in `course/<courseId>/quiz/score.json` → `"done"` (+4 pts)

## Agent analysis window

When reviewing, use **only the last 3 deliveries** (chronological).  
`collect-project-review-context.mjs` labels them `Delivery 1 of N … N of N (chronological)`.

Attach the review to the **latest delivery** in that window unless `--delivery-id` is specified.

## What the review comment must cover

Grade and write feedback **only** about:

1. **The exercise** — project README acceptance criteria, functional requirements, constraints
2. **Lesson context** — module concepts the solution should demonstrate (from module `README.md`)
3. **Code** — `starter/` implementation (correctness, explicit validation, edge cases from the README)

Delivery markdown counts **only** if it explains the solution (approach, tests, sample I/O). Ignore non-technical placeholder text; do not score “using the delivery feature”.

## What the review comment must NOT mention

- Study app UI, Delivery tab, `project-delivery.json`, or review/skill workflow
- Frontend architecture, catalog, Vite plugins, or repo tooling
- Folder/scaffolding conventions unrelated to solving the exercise
- Generic praise/blame about “submitting deliveries” instead of technical gaps

## Shared library

`frontend/scripts/project-delivery-lib.mjs` — normalize, append, setDeliveryReview (used by Vite plugin and skill scripts).
