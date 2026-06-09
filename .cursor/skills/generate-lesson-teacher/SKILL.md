---
name: generate-lesson-teacher
description: Generates lesson content (explanation + projects) following COURSE_STRUCTURE.md hierarchy. Use when creating or updating a single lesson under course/<course>/modules/<module>/lessons/.
disable-model-invocation: true
---

# Generate Lesson Content — Teacher Workflow

This skill focuses on generating **one lesson** (graph leaf) under the hierarchy in `COURSE_STRUCTURE.md`.

## Hierarchy

```
course/<course>/modules/<module>/lessons/<graphIndex>-<slug>/
  README.md          # explanation
  lesson.meta.json
  projects/          # optional
  quiz/              # optional
```

## Tools

All tools live in `.cursor/tools/teacher/` and `scripts/graph/`.

### 1) Find topic in graph

```bash
node .cursor/tools/graph/find-node-by-index.js "01.8.1"
node scripts/graph/generate-content-map.mjs   # check exists vs planned
```

### 2) Scaffold lesson folder

```bash
node scripts/graph/scaffold-from-graph.mjs "01.8.1"
# or:
node .cursor/tools/teacher/create-lesson-folder.js "01.8.1"
```

### 3) Append explanation markdown

```bash
cat explanation.md | node .cursor/tools/teacher/add-explanation.js javascript 01-javascript-fundamentals 01.8.1-truthy-vs-falsy
```

Hard rule: **never write unless `.cursor-created.json` exists** in the lesson folder.

### 4) Add PBL project (lesson-scoped)

```bash
node .cursor/tools/teacher/add-project-idea.js javascript 01-javascript-fundamentals 01.8.1-truthy-vs-falsy 1 "CLI Input Validator"
```

For authoring and validation, use **create-course-project** skill with `--lesson`:

```bash
node .cursor/skills/create-course-project/scripts/collect-project-context.mjs --course javascript --module 01-javascript-fundamentals --lesson 01.8.1-truthy-vs-falsy
node .cursor/skills/create-course-project/scripts/validate-project.mjs course/javascript/modules/01-javascript-fundamentals/lessons/01.8.1-truthy-vs-falsy/projects
```

### 5) Validate and catalog

```bash
node scripts/validate-lesson.mjs --lesson course/javascript/modules/01-javascript-fundamentals/lessons/01.8.1-truthy-vs-falsy
cd frontend && npm run catalog:generate
```

## When to choose graph vs teacher tools

- **Graph tools** — find topics, scaffold folders from `graphIndex`
- **Teacher tools** — write explanation markdown and add projects
