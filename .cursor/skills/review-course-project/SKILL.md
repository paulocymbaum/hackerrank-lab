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

3. **Save review** on the **latest delivery** (default):

```bash
node .cursor/skills/review-course-project/scripts/save-project-review.mjs \
  course/<module>/projects/<topic>/<project> \
  --score 85 \
  --comment "Clear validation; meets acceptance criteria for age=0 and empty input."
```

Optional: `--delivery-id <id>` to attach review to a specific delivery.

## Grading rules (STRICT)

| Rule | Detail |
|------|--------|
| Score | Integer **0–100** |
| Pass | **score > 80** → `done` in `course/<id>/quiz/score.json` |
| **In scope** | Module lesson concepts, project README criteria, `starter/` code, delivery text that explains the **exercise solution** |
| **Out of scope** | Study app UI, Delivery tab, `project-delivery.json`, `score.json`, catalog/frontend/repo architecture, skills/tooling, whether deliveries were “saved correctly” |
| Deliveries | Analyze **only the last 3** submissions (chronological); treat delivery body as optional solution write-up, not platform usage |
| Comment | Feedback on **correctness vs README + lesson** and **code quality** for the exercise; one concrete next step to pass acceptance criteria |
| Tone | Direct, educational — not Socratic (use `teacher-socratic` for questions) |

### Comment must NOT mention

- The Hackerrank Study frontend, Delivery tab, or how to use the study UI
- `project-delivery.json`, review workflow, or Cursor skills (except as invisible plumbing — never in student-facing comment text)
- Missing “delivery history”, placeholder delivery text as a **workflow** issue (do mention if write-up lacks **technical** explanation of the solution)
- Repo layout, catalog generation, or any architecture outside the PBL exercise itself

## Workflow checklist

```
- [ ] collect-project-review-context.mjs run
- [ ] At least one delivery exists
- [ ] Score 0-100 with justification tied to acceptance criteria
- [ ] save-project-review.mjs run (comment non-empty)
- [ ] If score > 80, confirm statusUpdated: true in script output
- [ ] Student refreshes Delivery tab to see score + comment
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
| [scripts/save-project-review.mjs](scripts/save-project-review.mjs) | Write review + optional done status |

### collect-project-review-context.mjs flags

- `--format json|markdown` (default: markdown)
- `--out <path>`

## Frontend

After saving, the student sees **score** and **comment** on each reviewed delivery in the **Delivery** tab.  
Passing score updates the project badge to **Done** after reload or re-opening the tab.
