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
      "id": "2026-06-09T00:00:19.245Z",
      "content": "Latest delivery…",
      "submittedAt": "2026-06-09T00:00:19.245Z",
      "review": {
        "score": 85,
        "comment": "Empty lines rejected; age/score use Number.isFinite. isActive handles any casing. Matches acceptance criteria.",
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
| `review.comment` | Plain text, **max 480 chars**, **max 5 lines** (validated by `save-project-review.mjs`) |
| `review.reviewedAt` | ISO timestamp |

## Comment format (strict)

The comment appears in the **Delivery tab**. Keep it scannable.

**Template:**

```text
[One sentence: strength or main gap vs README.] [One sentence: key bug or missing criterion.] Next: [one fix].
```

**Rules:**

| Do | Don't |
|----|-------|
| 2–4 short sentences | Markdown headers (`##`, `**Label:**`) |
| Name specific README criteria | Mention study UI, skills, or repo tooling |
| One `Next:` action | Long bullet lists or repeated sections |
| Plain language | Socratic questions |

**Good examples:**

```text
Pass (85): Empty strings rejected with clear errors; age/score use Number() and Number.isFinite. isActive accepts any casing. Solid match to acceptance criteria.

Fail — no code (10): No starter/index.js to evaluate. Next: read three stdin lines, reject empty input explicitly, parse with Number.isFinite, normalize isActive, print JSON or ERROR.

Fail — partial (45): Reads stdin but treats age=0 as missing (truthiness bug). Next: check line.length === 0 and use Number.isFinite instead of if (age).
```

**Bad example (too long, wrong scope):**

```text
**Module focus:** explicit conversion…
**Gaps vs acceptance criteria:**
- Cannot verify…
- Cannot verify…
**Next step:** Implement starter…
Also remember to use the Delivery tab correctly.
```

## Pass rule

- **Pass**: `score > 80`
- On pass, project status in `course/<courseId>/quiz/score.json` → `"done"` (+4 pts)

## What to grade

1. Project README acceptance criteria and requirements
2. Module lesson concepts (from module `README.md`)
3. `starter/` code
4. Delivery text **only** if it explains the solution (ignore placeholders)

## Out of scope (never in comment)

Study app UI, Delivery tab, `project-delivery.json`, skills, catalog, repo architecture, delivery workflow.

## Shared library

- `frontend/scripts/project-delivery-lib.mjs` — file IO
- `scripts/review-comment.mjs` — comment validation rules
