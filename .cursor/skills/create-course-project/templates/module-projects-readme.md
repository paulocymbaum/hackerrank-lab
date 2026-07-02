# Projects — {{MODULE_TITLE}}

## How to use
- Each topic lives in a folder `NN-.../`.
- Each exercise lives in a folder `NNN-.../` with `README.md`, `starter/`, and (optionally) `solution/`.
- Project numbers (`001`, `002`, …) are **sequential across the whole module**, not reset per topic.

## Recommended workflow
1. Open the project in the study UI (course → **Projects** tab → open project).
2. Read **Explanation**, browse **Folders/Files**, implement in `starter/`.
3. Run locally:

```bash
node starter/index.js < starter/sample.input
```

4. Use **Delivery → Run answer** to validate against `starter/tests.json` (requires dev server).
5. When done, use the **Delivery** tab to save your write-up (persisted as `project-delivery.json` in the project folder).

Each runnable project includes `starter/index.js`, `starter/tests.json`, and `starter/sample.input`.

## What you should practice in this module
- Applying the concepts from the module `README.md` in small, testable problems.
- Writing explicit validation and error handling.
- Keeping code readable: small functions, clear invariants, predictable inputs/outputs.

## Topic catalog

<!-- One ### `NN-topic-slug/` section per topic group; list each NNN-project with a one-line blurb. -->

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
