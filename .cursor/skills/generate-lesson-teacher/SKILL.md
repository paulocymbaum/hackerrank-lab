---
name: generate-lesson-teacher
description: Generates a complete course module lesson (folder + README content) following COURSE_STRUCTURE.md. Use when the user asks to create a new lesson/module in `course/`, check existing lessons, scaffold boilerplate, or append detailed markdown explanations deterministically.
disable-model-invocation: true
---

# Generate One Lesson (Module) — Teacher Workflow

This skill focuses on generating **one module lesson** under `course/` following `COURSE_STRUCTURE.md`.

## Additional authoring rules (must follow)

In addition to `COURSE_STRUCTURE.md`, follow the Cursor rule:

- `.cursor/rules/course-and-lesson-content.mdc`

Practical implications when generating or updating `course/<module>/README.md`:

- Include **Scope boundaries** (“in / out”) near the top.
- Keep the **tiered structure** when appropriate (beginner → intermediate → advanced).
- Use **predict-first** prompts before explanations.
- Use **checklists** and **self-tests**.
- When the lesson/module is about runtime ordering, async, recursion, errors, or debugging: the first main focus must be a **stack-first explanation** (deep **what / how / why**) with an explicit push/pop narrative and a small trace table.

### One-shot prompting template (for the stack-first section)

Use this as a copy/paste “one-shot” prompt when writing the opening explanation of a lesson. It is designed to produce a single, complete, render-ready markdown section.

```text
Write the opening section of a JavaScript lesson as render-ready Markdown.

Hard requirements:
- This must be the first main focus of the lesson.
- Teach the call stack with deep clarity using the structure: What / How / Why.
- Include a tiny trace table that explicitly narrates PUSH/POP of stack frames.
- Explain why stack traces are ordered as they are (most recent call first).
- Include exactly one small code snippet and walk through it step-by-step.
- End with a 3–7 bullet "Mental model summary".

Variables you MUST fill (keep them generic so this works for any lesson):
- Lesson title/topic (1 line):
- Where this topic shows up in real bugs (1–2 lines):
- Prerequisites assumed (bullets):
- Terms that must be defined in this section (bullets):
- One short code snippet that matches the lesson (paste it):

Constraints:
- Do not mention the event loop unless the lesson topic truly requires it.
- If the lesson is about async, explicitly separate call stack behavior from scheduling (tasks/microtasks).

Audience: <beginner | intermediate | mixed>
Tone: clear, precise, not hand-wavy
Length: ~40–120 lines of markdown
```

### One-shot prompting template (Course/Module README)

Use this when generating `course/<module>/README.md` in one pass.

```text
Write a complete course module README as render-ready Markdown for this repo.

Hard requirements:
- Start with a one-sentence purpose.
- Include "Scope boundaries" with IN / OUT bullet lists.
- If appropriate, use a 3-tier path: Tier 1 (Beginner), Tier 2 (Intermediate), Tier 3 (Advanced).
- For each tier include:
  - Core rule(s) of thumb
  - Key terms
  - Predict-first snippet(s)
  - Why this matters (real bug class)
  - Checklist (observable skills)
- Include "Common pitfalls" (short list).
- Include "Self-test (Tiered)" with at least one prompt per tier.
- Preserve any existing top-of-file markers exactly as provided (I will paste them).

Variables you MUST fill:
- Module title:
- Intended audience:
- Real-world motivation (3–6 bullets):
- Topics IN scope (bullets):
- Topics OUT of scope (bullets):
- Constraints (runtime/version/tooling) if any:

Output only Markdown.
```

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

### 5) Add lesson quiz (5–10 activities)

After example lessons exist, generate quiz JSON per lesson:

```bash
cat quiz.json | node .cursor/tools/teacher/add-lesson-quiz.js 01-javascript-fundamentals examples/01-truthy-falsy.md
```

Follow `.cursor/skills/generate-lesson-quiz/SKILL.md` for activity mix and schema.

## When to choose BFS/DFS vs these tools

- Use the **teacher tools** when the task is about **creating lesson files/folders**.
- Use the **graph tools** when the task is about **finding topics inside the mindmap graph**.
- Use **`generate-lesson-quiz`** when the task is about **quiz activities** for a lesson.

