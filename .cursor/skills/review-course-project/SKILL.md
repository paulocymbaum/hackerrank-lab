---
name: review-course-project
description: >-
  Reviews one PBL project delivery using the last 3 student submissions (ordered),
  project README acceptance criteria, and starter code. Saves score 0-100 and comment
  on a delivery in project-delivery.json; sets project status to done when score > 80.
  Use when the user asks to grade, review, or correct a project submission or delivery.
disable-model-invocation: true
---

# Review Course Project

Grade **one project** based on the **last 3 deliveries** (oldest → newest), the project README, and starter code.

Full schema: [reference.md](reference.md)

## Quick start

1. **Collect review context** (always run first):

```bash
node .cursor/skills/review-course-project/scripts/collect-project-review-context.mjs course/<module>/projects/<topic>/<project>
```

Example:

```bash
node .cursor/skills/review-course-project/scripts/collect-project-review-context.mjs \
  course/01-javascript-fundamentals/projects/01-coercion-and-validation/001-cli-input-validator
```

2. **Grade** using only the material in the context output:
   - **Module lesson context** (`course/<id>/README.md` — concepts the project applies)
   - **Project README** (acceptance criteria, functional requirements, constraints)
   - **Starter code** (`starter/` — the student implementation)
   - **Last 3 deliveries** — only as a written explanation of the solution (approach, tests, trade-offs); ignore placeholder or non-technical text
   - Solution files are reference only — do not require matching the reference implementation

3. **Save review** on the **latest delivery** (default). Comment must pass validation (short, plain text):

```bash
node .cursor/skills/review-course-project/scripts/save-project-review.mjs \
  course/<module>/projects/<topic>/<project> \
  --score 85 \
  --comment "Empty lines rejected; age/score use Number.isFinite. isActive handles any casing. Matches acceptance criteria."
```

Optional: `--delivery-id <id>` to attach review to a specific delivery.

If save fails validation, shorten to **2–4 sentences** and remove markdown section headers. See [reference.md](reference.md).

## Grading rules (STRICT)

| Rule | Detail |
|------|--------|
| Score | Integer **0–100** |
| Pass | **score > 80** → `done` in `course/<id>/quiz/score.json` |
| **In scope** | Module lesson concepts, project README criteria, `starter/` code, delivery text that explains the **exercise solution** |
| **Out of scope** | Study app UI, Delivery tab, `project-delivery.json`, `score.json`, catalog/frontend/repo architecture, skills/tooling, whether deliveries were “saved correctly” |
| Deliveries | Analyze **only the last 3** submissions (chronological); treat delivery body as optional solution write-up, not platform usage |
| **Comment length** | **Max 480 characters**, **max 5 non-empty lines** — enforced by `save-project-review.mjs` |
| **Comment style** | 2–4 plain sentences: gap/strength → missing criterion → `Next: one fix`. No `**Section:**` headers or bullet essays |
| Comment scope | README + lesson + `starter/` only — one concrete next step |
| Tone | Direct, educational — not Socratic (use `teacher-socratic` for questions) |

### Comment template

```text
[One sentence: strength or main gap vs README.] [One sentence: key bug or missing criterion.] Next: [single fix].
```

Examples in [reference.md](reference.md). The save script **rejects** comments that are too long or mention banned platform/tooling phrases.

### Comment must NOT mention

- The Hackerrank Study frontend, Delivery tab, or how to use the study UI
- `project-delivery.json`, review workflow, or Cursor skills (except as invisible plumbing — never in student-facing comment text)
- Missing “delivery history”, placeholder delivery text as a **workflow** issue (do mention if write-up lacks **technical** explanation of the solution)
- Repo layout, catalog generation, or any architecture outside the PBL exercise itself

## Workflow checklist

```
- [ ] collect-project-review-context.mjs run
- [ ] Score 0-100 tied to README acceptance criteria + starter/ code
- [ ] Comment is 2-4 sentences, ≤480 chars, no markdown headers
- [ ] save-project-review.mjs passes validation
- [ ] If score > 80, confirm statusUpdated: true in script output
```

## When to use other skills

| Need | Skill |
|------|-------|
| Grade / score a delivery | **review-course-project** (this skill) |
| Hints, concepts, Socratic help | **teacher-socratic** |
| Create or fix project structure | **create-course-project** |

## Scripts

| Script | Purpose |
|--------|---------|
| [scripts/collect-project-review-context.mjs](scripts/collect-project-review-context.mjs) | README + last 3 deliveries + code |
| [scripts/save-project-review.mjs](scripts/save-project-review.mjs) | Write review + optional done status (validates comment length) |
| [scripts/review-comment.mjs](scripts/review-comment.mjs) | Comment rules and validation |

### collect-project-review-context.mjs flags

- `--format json|markdown` (default: markdown)
- `--out <path>`

## Frontend

After saving, the student sees **score** and **comment** on each reviewed delivery in the **Delivery** tab.  
Passing score updates the project badge to **Done** after reload or re-opening the tab.
