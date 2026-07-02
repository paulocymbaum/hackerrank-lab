---
name: create-course-project
description: >-
  Creates and validates PBL projects under lesson folders
  course/<course>/modules/<module>/lessons/<lesson>/projects/. Collects lesson context,
  scaffolds project folders, enforces the PBL README contract, starter/tests.json validation
  cases, and runs validation plus catalog:generate.
---

# Create Lesson Project

Centralized PBL structure for lesson-scoped projects. Full spec: [reference.md](reference.md).

## Quick start

1. **Collect context** (always run first):

```bash
node .cursor/skills/create-course-project/scripts/collect-project-context.mjs --course javascript --module 01-javascript-fundamentals --lesson 01.8.1-truthy-vs-falsy
```

2. **Scaffold** (new project folder + skeleton README + starter bundle):

```bash
node .cursor/tools/teacher/add-project-idea.js javascript 01-javascript-fundamentals 01.8.1-truthy-vs-falsy 1 "CLI Input Validator"
```

This creates `starter/index.js`, `starter/tests.json`, and `starter/sample.input` from templates.

3. **Fill content** in project `README.md` using lesson README as source truth. Each project must include `## Lesson concepts practiced` with at least 2 items from the lesson's Predict first / What to observe sections.

4. **Configure starter & tests** (see [Starter & validation tests](#starter--validation-tests-required) below).

5. **Update** lesson `projects/README.md` catalog.

6. **Validate**:

```bash
node .cursor/skills/create-course-project/scripts/validate-project.mjs course/javascript/modules/01-javascript-fundamentals/lessons/01.8.1-truthy-vs-falsy/projects
```

7. **Regenerate catalog**:

```bash
cd frontend && npm run catalog:generate
```

## Starter & validation tests (required)

Every runnable project needs **three files** under `starter/`:

| File | Role |
|------|------|
| `starter/index.js` | Incomplete scaffold — imported into the Delivery draft; student completes the solution |
| `starter/tests.json` | Automated validation — Delivery **Run answer** runs every case and shows Pass/Fail |
| `starter/sample.input` | Example stdin for manual CLI (`node starter/index.js < starter/sample.input`) |

The starter must **not** solve the problem. `tests.json` defines what a correct solution must output.

### Authoring workflow

1. Customize `starter/index.js` from [templates/starter-index.js](templates/starter-index.js) — keep a runnable stub (`Not implemented yet` is fine).
2. Write **Example data (if applicable)** in the project README with realistic stdin/stdout.
3. Copy the primary example into `starter/sample.input` (one stdin value per line; multi-line programs need separate lines).
4. Map each **I/O-testable** acceptance criterion to a case in `starter/tests.json`.
5. Non-IO checks (immutability, naming, API usage) stay in README for AI review — do **not** put them in `tests.json`.
6. Ensure at least **one scored case** (`expectedStdout` and/or `expectedExitCode`) so **Run answer** shows Pass/Fail, not only smoke **Ran** status.

### `tests.json` schema

Template: [templates/starter-tests.json](templates/starter-tests.json)

```json
{
  "cases": [
    {
      "id": "example",
      "name": "Example from README",
      "stdin": "line1\nline2\n",
      "expectedStdout": "expected output\n",
      "expectedExitCode": 0
    }
  ]
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | Stable kebab-case slug |
| `name` | yes | Label in the Delivery test matrix UI |
| `stdin` | yes | Piped to `process.stdin` (may be `""`) |
| `expectedStdout` | recommended | Compared with `trimEnd`; drives **Pass/Fail** |
| `expectedExitCode` | optional | Compared when present |

Rules:

- `tests.json` takes **priority** over `sample.input` for **Run answer** — keep both files.
- Cases without `expectedStdout` or `expectedExitCode` run as **smoke** (status **Ran**, not scored).
- `sample.input` is **not** imported into the delivery draft (unlike `starter/index.js`).

### Study UI behavior

After `catalog:generate` and with the Vite dev server running:

- **Delivery → Run answer** executes all `tests.json` cases against code in the delivery draft.
- The test matrix lists case names and Pass/Fail per case (configured cases show before the first run).
- Without `tests.json` (and without `sample.input`), **Run answer** is unavailable.

## Workflow checklist

```
- [ ] collect-project-context.mjs --lesson run
- [ ] Project number (NNN) is next sequential id in the lesson
- [ ] README has all required PBL sections (English headers)
- [ ] README has ## Lesson concepts practiced (≥2 items from lesson)
- [ ] starter/index.js exists (node starter/index.js)
- [ ] starter/sample.input matches README Example data
- [ ] starter/tests.json exists with ≥1 scored case (expectedStdout or expectedExitCode)
- [ ] Each I/O acceptance criterion has a matching tests.json case
- [ ] projects/README.md catalog updated
- [ ] validate-project.mjs passes (no errors; fix unscored-tests warnings)
- [ ] catalog:generate run
- [ ] Spot-check Delivery → Run answer in UI
```

## When to use teacher tools vs this skill

| Task | Tool |
|------|------|
| New module | `create-course-module` skill / `scaffold-from-graph.mjs --module` |
| New lesson | `create-lesson-folder.js` / `scaffold-from-graph.mjs` |
| New project folder | `add-project-idea.js` (lesson mode) |
| Author / review PBL | This skill + `collect-project-context.mjs --lesson` |

## Templates

| File | Purpose |
|------|---------|
| [templates/lesson-projects-readme.md](templates/lesson-projects-readme.md) | Lesson `projects/README.md` |
| [templates/module-projects-readme.md](templates/module-projects-readme.md) | Legacy module `projects/README.md` |
| [templates/project-readme-skeleton.md](templates/project-readme-skeleton.md) | New project README |
| [templates/starter-index.js](templates/starter-index.js) | `starter/index.js` stub |
| [templates/starter-tests.json](templates/starter-tests.json) | `starter/tests.json` validation cases |
| [templates/starter-sample.input](templates/starter-sample.input) | `starter/sample.input` example stdin |

## Scripts

| Script | Purpose |
|--------|---------|
| [scripts/collect-project-context.mjs](scripts/collect-project-context.mjs) | Lesson/module README + existing projects + starter flags |
| [scripts/validate-project.mjs](scripts/validate-project.mjs) | PBL README, alignment, starter/tests.json validation |
| [scripts/project-contract.mjs](scripts/project-contract.mjs) | Shared contract constants and validators |

## Output locations (canonical)

```text
course/<course>/modules/<module>/lessons/<lesson>/projects/
  README.md
  <NNN-project>/
    README.md
    starter/
      index.js       # scaffold (imported into Delivery draft)
      tests.json     # validation cases for Delivery “Run answer”
      sample.input   # example stdin (manual CLI; not removed)
    solution/              (optional)
    project-delivery.json  (student writes via UI)
```

Legacy: `course/<NN-module>/projects/<NN-topic>/<NNN-project>/`

## Related

- Lesson scaffolding: [generate-lesson-teacher/SKILL.md](../generate-lesson-teacher/SKILL.md)
- Repo structure: [COURSE_STRUCTURE.md](../../../COURSE_STRUCTURE.md)
