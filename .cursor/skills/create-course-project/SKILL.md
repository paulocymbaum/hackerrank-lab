---
name: create-course-project
description: >-
  Creates and validates PBL projects under course/<module>/projects/. Collects
  module context, scaffolds topic/project folders, enforces the PBL README contract,
  and runs validation plus catalog:generate. Use when the user asks to create, add,
  or update a course project, PBL exercise, projects README, or project delivery track.
---

# Create Course Project

Centralized PBL structure for `course/<module>/projects/`. Full spec: [reference.md](reference.md).

## Quick start

1. **Collect context** (always run first):

```bash
node .cursor/skills/create-course-project/scripts/collect-project-context.mjs <course-id>
```

Use `--list` for course ids. Example: `01-javascript-fundamentals`.

2. **Scaffold** (new project folders + skeleton README + starter stub):

```bash
node .cursor/tools/teacher/add-project-idea.js <moduleDir> <topicN> "Topic Title" <projectN> "Project Title"
```

3. **Fill content** in the project `README.md` using module README + `examples/` as source truth. Follow the PBL sections in [reference.md](reference.md).

4. **Update** module `projects/README.md` topic catalog (one `### NN-topic/` block per group).

5. **Validate**:

```bash
node .cursor/skills/create-course-project/scripts/validate-project.mjs course/<course-id>
```

6. **Regenerate catalog**:

```bash
cd frontend && npm run catalog:generate
```

## Workflow checklist

```
- [ ] collect-project-context.mjs run for target module
- [ ] Project number (NNN) is next sequential id in the module
- [ ] README has all required PBL sections (English headers)
- [ ] starter/index.js exists and runs (node starter/index.js)
- [ ] projects/README.md has topic catalog entry for the new project
- [ ] validate-project.mjs passes (no errors)
- [ ] catalog:generate run
```

## When to use teacher tools vs this skill

| Task | Tool |
|------|------|
| New module + empty `projects/README.md` | `create-lesson-folder.js` |
| New project folder tree | `add-project-idea.js` |
| Author / review PBL content | This skill + `collect-project-context.mjs` |
| Check structure across repo | `validate-project.mjs --all` |

## Project quality

- **Problem-first**: realistic scenario tied to module mental models (not generic CRUD).
- **Testable requirements**: checkbox functional + acceptance criteria; avoid vague “make it work”.
- **Example data**: stdin/stdout pairs, JSON lines, or JS snippets with expected output.
- **Suggested plan**: guide without revealing solution code.
- **Constraints**: explicit (Node-only, no external deps, allowed APIs).
- **Do not** invent topics outside the module scope.

## Templates (single source)

| File | Purpose |
|------|---------|
| [templates/module-projects-readme.md](templates/module-projects-readme.md) | Module `projects/README.md` |
| [templates/project-readme-skeleton.md](templates/project-readme-skeleton.md) | New project README |
| [templates/starter-index.js](templates/starter-index.js) | `starter/index.js` stub |

Shared validation logic: [scripts/project-contract.mjs](scripts/project-contract.mjs)

## Scripts

| Script | Purpose |
|--------|---------|
| [scripts/collect-project-context.mjs](scripts/collect-project-context.mjs) | Module README + projects overview + existing projects |
| [scripts/validate-project.mjs](scripts/validate-project.mjs) | Structure and PBL section checks |
| [scripts/project-contract.mjs](scripts/project-contract.mjs) | Section list + validators (imported by scripts) |

### collect-project-context.mjs flags

- `--list` — print course folder ids
- `--format json|markdown` (default: markdown)
- `--out <path>` — write to file
- `--keep-markers` — retain HTML comment markers

### validate-project.mjs

- `course/<module-id>` — validate module overview + all projects
- `course/<module>/projects/<topic>/<project>` — single project
- `--all` — every module with `projects/`

Exit code `1` on errors.

## Output locations

```text
course/<NN-module-slug>/projects/README.md
course/<NN-module-slug>/projects/<NN-topic>/<NNN-project>/
  README.md
  starter/index.js
  solution/              (optional)
  project-delivery.json  (student; UI only)
```

## Related

- Module scaffolding: [.cursor/skills/generate-lesson-teacher/SKILL.md](../generate-lesson-teacher/SKILL.md)
- Grade deliveries: [.cursor/skills/review-course-project/SKILL.md](../review-course-project/SKILL.md)
- Repo structure: [`COURSE_STRUCTURE.md`](../../../COURSE_STRUCTURE.md)
- Frontend reader + Delivery tab: [`frontend/ARCHITECTURE-FRONT.md`](../../../frontend/ARCHITECTURE-FRONT.md)
- Gold-standard project: `course/02-objects-references-and-copying/projects/01-data-shaping-and-safety/001-safe-normalizer/`
