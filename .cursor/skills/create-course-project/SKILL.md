---
name: create-course-project
description: >-
  Creates and validates PBL projects under lesson folders
  course/<course>/modules/<module>/lessons/<lesson>/projects/. Collects lesson context,
  scaffolds project folders, enforces the PBL README contract, and runs validation
  plus catalog:generate.
---

# Create Lesson Project

Centralized PBL structure for lesson-scoped projects. Full spec: [reference.md](reference.md).

## Quick start

1. **Collect context** (always run first):

```bash
node .cursor/skills/create-course-project/scripts/collect-project-context.mjs --course javascript --module 01-javascript-fundamentals --lesson 01.8.1-truthy-vs-falsy
```

2. **Scaffold** (new project folder + skeleton README + starter):

```bash
node .cursor/tools/teacher/add-project-idea.js javascript 01-javascript-fundamentals 01.8.1-truthy-vs-falsy 1 "CLI Input Validator"
```

3. **Fill content** in project `README.md` using lesson README as source truth. Each project must include `## Lesson concepts practiced` with at least 2 items from the lesson's Predict first / What to observe sections.

4. **Update** lesson `projects/README.md` catalog.

5. **Validate**:

```bash
node .cursor/skills/create-course-project/scripts/validate-project.mjs course/javascript/modules/01-javascript-fundamentals/lessons/01.8.1-truthy-vs-falsy/projects
```

6. **Regenerate catalog**:

```bash
cd frontend && npm run catalog:generate
```

## Workflow checklist

```
- [ ] collect-project-context.mjs --lesson run
- [ ] Project number (NNN) is next sequential id in the lesson
- [ ] README has all required PBL sections (English headers)
- [ ] README has ## Lesson concepts practiced (≥2 items from lesson)
- [ ] starter/index.js exists (node starter/index.js)
- [ ] starter/tests.json exists (validation cases; powers Delivery **Run answer** matrix)
- [ ] starter/sample.input exists (example stdin for manual CLI)
- [ ] projects/README.md catalog updated
- [ ] validate-project.mjs passes
- [ ] catalog:generate run
```

## When to use teacher tools vs this skill

| Task | Tool |
|------|---------|
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

## Output locations (canonical)

```text
course/<course>/modules/<module>/lessons/<lesson>/projects/
  README.md
  <NNN-project>/
    README.md
    starter/index.js
    starter/index.js
    starter/tests.json   # validation cases for Delivery “Run answer”
    starter/sample.input # example stdin (manual CLI; not removed)
    solution/              (optional)
```

Legacy: `course/<NN-module>/projects/<NN-topic>/<NNN-project>/`

## Related

- Lesson scaffolding: [generate-lesson-teacher/SKILL.md](../generate-lesson-teacher/SKILL.md)
- Repo structure: [COURSE_STRUCTURE.md](../../../COURSE_STRUCTURE.md)
