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
          sample.input              # stdin fixture for UI “Run sample” (recommended)
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
Projects without `starter/sample.input` hide the Delivery tab **Run sample** button.

### Sample input file

Template: [`templates/starter-sample.input`](templates/starter-sample.input)

- Path: `starter/sample.input`
- Content: realistic stdin from the project README **Example data** section (one or more lines).
- Multi-line programs need **one value per line** (e.g. receipt printer: item, quantity, price on separate lines).
- Used by the study UI Delivery tab: **Run sample** pipes this file into `starter/index.js` (or the `starter/index.js` block imported into the delivery draft) and shows stdout/stderr below the button.
- Requires the Vite dev server (`npm run dev`); the button is disabled when sample input or runnable code is missing.

## Study UI integration

After `npm run catalog:generate`:

- Projects appear under course tab **Projects** when root `README.md` is non-empty.
- Reader tabs: **Context**, **Delivery** (embedded project drawer).
- **Delivery** saves versions to `project-delivery.json` (dev server writes to disk).
- **Delivery → Run sample** executes `node starter/index.js < starter/sample.input` and shows the log under the button (dev server only).
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

Warnings: missing `starter/index.js`, sparse module overview, optional sections.

## Authoring workflow

1. `collect-project-context.mjs <course-id>` — read module + existing projects
2. List 3 outcomes from the lesson **Predict first** / **What to observe** sections
3. Fill PBL sections; map each outcome to an acceptance criterion
4. Ensure `starter/index.js` and `starter/sample.input` exist
5. Update module `projects/README.md` topic catalog
6. `validate-project.mjs`
7. `cd frontend && npm run catalog:generate`
