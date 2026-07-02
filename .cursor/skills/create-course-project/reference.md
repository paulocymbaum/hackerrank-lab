# PBL project structure reference

Canonical spec for practice exercises under `course/<module>/projects/`.  
Normative repo doc: [`COURSE_STRUCTURE.md`](../../../COURSE_STRUCTURE.md) (Portuguese overview).  
This reference is the **English, tooling-aligned** contract used by teacher scripts and the study UI.

## Directory tree

```text
course/<NN-module-slug>/
  README.md
  examples/                         # optional lessons
  projects/
    README.md                       # module projects overview (required)
    <NN-topic-slug>/                # e.g. 01-coercion-and-validation/
      <NNN-project-slug>/           # e.g. 001-cli-input-validator/
        README.md                   # PBL problem statement (required, non-empty)
        starter/
          index.js                  # entrypoint (required for runnable projects)
          tests.json                # validation cases for Delivery “Run answer” (recommended)
          sample.input              # example stdin for manual CLI / context (recommended)
        solution/                   # optional reference implementation
        project-delivery.json       # student delivery history (UI, dev server)
```

## Numbering rules

| Level | Pattern | Scope | Example |
|-------|---------|-------|---------|
| Module | `NN-kebab-case` | whole repo | `01-javascript-fundamentals` |
| Topic group | `NN-kebab-case` | inside `projects/` | `01-coercion-and-validation` |
| Project | `NNN-kebab-case` | **sequential across module** | `001`, `002`, `003` |

Project ids (`001-…`) do **not** reset per topic folder. Topic `02-…` may contain `003-…` if earlier numbers were used in topic `01-…`.

## Module `projects/README.md` (required sections)

Use template: [`templates/module-projects-readme.md`](templates/module-projects-readme.md)

Must include:

1. **How to use** — folder conventions (`NN-`, `NNN-`, global numbering)
2. **Recommended workflow** — UI tabs + `node starter/index.js` + **Delivery** tab
3. **What you should practice** — ties to module README
4. **Topic catalog** — one `### NN-topic/` block per group with project blurbs
5. **Project structure (PBL contract)** — section list below

## Project `README.md` (PBL contract)

Use template: [`templates/project-readme-skeleton.md`](templates/project-readme-skeleton.md)

| Section | Required | Notes |
|---------|----------|-------|
| `# Title` | yes | Human-readable project name |
| Problem context | yes | Realistic scenario |
| Goal | yes | What to build |
| Lesson concepts practiced | yes | At least 2 checkboxes tied to lesson Predict first / What to observe |
| Functional requirements | yes | Checkbox list |
| Non-functional requirements | yes | Quality, errors, performance |
| Constraints | yes | Node-only, no libs, I/O format |
| Acceptance criteria | yes | Verifiable checklist |
| Example data (if applicable) | recommended | stdin/stdout, JSON samples |
| Suggested plan (no solution) | yes | Steps without giving away code |
| Deliverables | yes | Mention `starter/` (+ optional `solution/`) |
| Extensions (optional) | optional | Stretch goals |

**Language:** English section headers in all live content (matches existing projects).

## Starter entrypoint

Template: [`templates/starter-index.js`](templates/starter-index.js)

```bash
node starter/index.js < starter/sample.input
```

Projects without `starter/index.js` are valid in the catalog but flagged as **not runnable**.  
Projects without `starter/tests.json` (and without `starter/sample.input`) cannot use Delivery **Run answer**.

### Starter vs tests (roles)

| File | Role |
|------|------|
| `starter/index.js` | Incomplete scaffold — import into the delivery draft; student completes the solution |
| `starter/sample.input` | Example stdin for manual `node starter/index.js < starter/sample.input` |
| `starter/tests.json` | Automated validation — Delivery **Run answer** runs every case and shows Pass/Fail |

The starter does **not** solve the problem; `tests.json` defines what a correct solution must output.

### Test cases file

Template: [`templates/starter-tests.json`](templates/starter-tests.json)

Path: `starter/tests.json`

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
| `name` | yes | Label in the test matrix UI |
| `stdin` | yes | Piped to `process.stdin` (may be `""`) |
| `expectedStdout` | recommended | Compared with `trimEnd`; drives **Pass/Fail** |
| `expectedExitCode` | optional | Compared when present |

Rules:

- Include only **I/O-testable** acceptance criteria (stdin/stdout/exit). Non-IO checks (immutability, API usage) stay in README for AI review.
- Cases without `expectedStdout` or `expectedExitCode` run as **smoke** (status **Ran**, not scored).
- `tests.json` takes priority over `sample.input` for **Run answer**; keep both files.

### Sample input file

Template: [`templates/starter-sample.input`](templates/starter-sample.input)

- Path: `starter/sample.input`
- Content: realistic stdin from the project README **Example data** section (one or more lines).
- Multi-line programs need **one value per line** (e.g. receipt printer: item, quantity, price on separate lines).
- Used for manual CLI runs and as fallback when `tests.json` is missing.
- **Not** imported into the delivery draft (unlike `starter/index.js`).

## Study UI integration

After `npm run catalog:generate`:

- Projects appear under course tab **Projects** when root `README.md` is non-empty.
- Reader tabs: **Context**, **Delivery** (embedded project drawer).
- **Delivery** saves versions to `project-delivery.json` (dev server writes to disk).
- **Delivery → Run answer** runs all `tests.json` cases (or `sample.input` as a single smoke case) against code in the delivery draft and shows a **test matrix** (Pass/Fail per case).
- Requires the Vite dev server (`npm run dev`).
- **review-course-project** skill grades the last 3 deliveries and writes `review` (score 0–100 + comment) on a delivery; score **> 80** marks project **done**.

Types: `frontend/src/domain/types/catalog.ts`, `frontend/src/domain/types/projectDelivery.ts`

## Gold-standard examples on disk

| What | Path |
|------|------|
| Best project README | `course/02-objects-references-and-copying/projects/01-data-shaping-and-safety/001-safe-normalizer/README.md` |
| Runnable starter | same folder `starter/index.js` |
| Topic catalog style | `course/03-asynchronous-javascript-runtime-model-event-loop/projects/README.md` |

## Scaffolding tools

```bash
# New module (creates projects/README.md from template)
node .cursor/tools/teacher/create-lesson-folder.js 1 "Module Title"

# New project folders + README skeleton + starter stub
node .cursor/tools/teacher/add-project-idea.js <moduleDir> <topicN> "Topic Title" <projectN> "Project Title"
```

## Validation

```bash
node .cursor/skills/create-course-project/scripts/validate-project.mjs course/<module-id>
node .cursor/skills/create-course-project/scripts/validate-project.mjs --all
```

Exit code `1` when any **error** (missing required README sections, empty project README).

Warnings: missing `starter/index.js`, missing or unscored `starter/tests.json`, sparse module overview, optional sections.

## Authoring workflow

1. `collect-project-context.mjs <course-id>` — read module + existing projects
2. List 3 outcomes from the lesson **Predict first** / **What to observe** sections
3. Fill PBL sections; map each I/O outcome to a `tests.json` case
4. Ensure `starter/index.js`, `starter/tests.json`, and `starter/sample.input` exist
5. Update module `projects/README.md` topic catalog
6. `validate-project.mjs`
7. `cd frontend && npm run catalog:generate`
