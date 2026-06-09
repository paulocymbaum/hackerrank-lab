# Projects — JavaScript Fundamentals

## How to use
- Each topic lives in a folder `NN-.../`.
- Each exercise lives in a folder `NNN-.../` with `README.md`, `starter/`, and (optionally) `solution/`.
- Project numbers (`001`, `002`, …) are **sequential across the whole module**, not reset per topic.

## Recommended workflow
1. Open the project in the study UI (course → **Projects** tab → open project).
2. Read **Explanation**, browse **Folders/Files**, implement in `starter/`.
3. Run locally:

```bash
node starter/index.js
```

4. When done, use the **Delivery** tab to save your write-up (persisted as `project-delivery.json` in the project folder).

If `starter/index.js` doesn't exist yet, create it as your entrypoint.

## What you should practice in this module
- Writing **explicit** checks instead of relying on coercion.
- Validating and normalizing CLI inputs safely (common in HackerRank-style tasks).
- Keeping error messages specific (field + reason).

## Topic catalog

### `01-coercion-and-validation/`
- Focus: **explicit conversion** and defensive validation on stdin.
- Projects:
  - `001-cli-input-validator/`: parse age, score, and boolean flags without truthiness traps.
  - `002-data-normalizer/`: normalize messy JSON-ish records with strict field rules.

### `02-comparisons-and-rules/`
- Focus: **comparison semantics** and filtering with predictable rules.
- Projects:
  - `003-record-filter/`: filter records using explicit comparison rules (no implicit coercion).

## Project structure (PBL contract)
Each project `README.md` must include (minimum):
- **Problem context**
- **Goal**
- **Functional requirements**
- **Non-functional requirements**
- **Constraints**
- **Acceptance criteria**
- **Example data** (if applicable)
- **Suggested plan (no solution)**
- **Deliverables** (`starter/` and optionally `solution/`)
- **Extensions** (optional)

See `.cursor/skills/create-course-project/reference.md` and `COURSE_STRUCTURE.md`.
