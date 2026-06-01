---
name: generate-lesson-teacher
description: Generates a complete course module lesson (folder + README content) following COURSE_STRUCTURE.md. Use when the user asks to create a new lesson/module in `course/`, check existing lessons, scaffold boilerplate, or append detailed markdown explanations deterministically.
disable-model-invocation: true
---

# Generate One Lesson (Module) — Teacher Workflow

This skill focuses on generating **one module lesson** under `course/` following `COURSE_STRUCTURE.md`.

## Repo contract (from `COURSE_STRUCTURE.md`)

- Root folder is `course/`
- Each module folder is `NN-kebab-case-title/` (or `00-welcome/`)
- Each module contains:
  - `README.md` (detailed explanation)
  - `examples/` (recommended)
  - `projects/README.md` (projects overview — must be complete)

## Tools (runnable)

All tools live in `.cursor/tools/teacher/`.

### Shared building blocks

Note: `create-lesson-folder.js` may **not** create `examples/` automatically. When you need `examples/`, create that folder explicitly (e.g. via `mkdir -p course/<module>/examples`) *before* generating example files with `add-explanation.js`.

Also: use the teacher tools below to keep module generation deterministic and consistent with `COURSE_STRUCTURE.md`.

### 1) Check previous lessons

Use when you need to avoid duplicate modules, confirm numbering, or find what already exists.

```bash
node .cursor/tools/teacher/check-lessons.js
```

### 2) Generate folder boilerplate (deterministic)

Use when starting a new lesson/module. This creates the required structure and a marker file.

```bash
node .cursor/tools/teacher/create-lesson-folder.js 1 "Fundamentos de JavaScript"
```

Notes:
- The boilerplate tool must create a **render-ready** `projects/README.md` following the `COURSE_STRUCTURE.md` contract:
  - how to run projects
  - folder conventions
  - what each project README must contain (PBL sections)
 - The boilerplate tool may not create `examples/` yet. If your module needs examples (recommended), create `course/<module>/examples/` before step 3.

### 3) Append explanation markdown (ONLY if created by the tool)

Use when you already created the module folder with the boilerplate tool and you want to write the complete lesson content into `course/<module>/README.md`.

The tool reads a multi-line markdown string from stdin and appends it.

```bash
cat explanation.md | node .cursor/tools/teacher/add-explanation.js 01-fundamentos-de-javascript
```

You may also use this tool to generate render-ready markdown files under the module (e.g. `examples/...`) by passing a `targetFile`:

```bash
cat example.md | node .cursor/tools/teacher/add-explanation.js 01-fundamentos-de-javascript course examples/01-some-example.md
```

Hard rule: **never write explanations with the tool unless `course/<module>/.cursor-created.json` exists**.

### 4) Add one PBL project idea (folder + template)

Use when you want to add a new practice exercise under `projects/` following the PBL README structure in `COURSE_STRUCTURE.md`.

```bash
node .cursor/tools/teacher/add-project-idea.js 01-fundamentos-de-javascript 1 "Sintaxe e Estruturas" 1 "Calculadora CLI"
```

Hard rule: when generating a new module, you must use `add-project-idea.js` at least once to populate the `projects/<NN-topic>/<NNN-project>/` structure (folders + template README) so the module has a complete, runnable practice track.

## When to choose BFS/DFS vs these tools

- Use the **teacher tools** when the task is about **creating lesson files/folders**.
- Use the **graph tools** when the task is about **finding topics inside the mindmap graph**.

