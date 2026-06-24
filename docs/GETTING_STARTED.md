# Getting Started

Operational guide for learners and content authors using the Hackerrank Study **educational harness** and **interactive UI**.

← Back to [README](../README.md) for project overview and architecture.

---

## Table of contents

1. [Local environment](#local-environment)
2. [Per-lesson workflow](#per-lesson-workflow)
3. [Route reference](#route-reference)
4. [Studying with the Cursor Agent](#studying-with-the-cursor-agent)
5. [Cursor skills overview](#cursor-skills-overview)
6. [Prompting tips](#prompting-tips)
7. [Skills for learners](#skills-for-learners)
8. [Skills for content authors](#skills-for-content-authors)
9. [Useful commands](#useful-commands)
10. [Further reading](#further-reading)

---

## Local environment

```bash
cd frontend
npm install
npm run catalog:generate   # sync course/ → static catalog
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

From the **repo root**, shortcuts are available:

```bash
npm run dev                # same as cd frontend && npm run dev
npm run catalog:generate   # regenerate catalog after editing course/
```

Run `npm run catalog:generate` whenever you add or rename lessons, modules, projects, or quizzes under `course/`.

---

## Per-lesson workflow

Recommended flow for each lesson:

1. **Catalog** → choose a course (e.g. JavaScript)
2. **Module** → read the module README and review the lesson map
3. **Lesson** → read the explanation; complete the *predict-first* mini-exercise before running the code
4. **Quiz** → open the lesson quiz, answer questions, read explanations on wrong choices
5. **Project (PBL)** → implement in `starter/index.js`, test with Node.js, record your delivery in the **Delivery** tab

Progress for quizzes and projects is saved in the browser. Aggregated scores are written to `course/<course>/quiz/score.json` during local development.

### Suggested study rhythm

- One lesson per short session, or half a module per long session
- Always **predict** output before executing examples
- Redo quizzes with low scores after re-reading the explanation
- Iterate on projects until the review score is **> 80** (pass threshold)

---

## Route reference

Primary navigation uses the `hierarchy` structure:

```text
/                                                          → Catalog
/course/javascript                                         → Course overview
/course/javascript/module/01-javascript-fundamentals       → Module
/course/javascript/module/.../lesson/01.8.1-truthy-vs-falsy → Lesson
  ?drawer=quiz&quiz=<id>                                   → Quiz in side drawer
  ?drawer=project&project=<id>                             → Project in side drawer
  ?drawerTab=files|delivery                                → Project drawer tab
```

See [frontend/ARCHITECTURE-FRONT.md](../frontend/ARCHITECTURE-FRONT.md) for the full learner navigation journey.

---

## Studying with the Cursor Agent

Open this repository in **Cursor**, start the Agent (Chat), and invoke **skills** for guided workflows. Skills teach the agent *how* to act — which scripts to run, which rules to follow, and what tone to use — instead of improvising each conversation.

Skills live in [`.cursor/skills/<name>/SKILL.md`](../.cursor/skills/). Each skill defines:

- **When to use** — triggers in the frontmatter `description`
- **Behavior** — steps, checklists, and constraints
- **Scripts** — terminal commands the agent should execute

---

## Cursor skills overview

Some skills have `disable-model-invocation: true`, meaning the agent **will not** pick them automatically. You must invoke them explicitly (mention the skill name or attach it with `@` in Cursor chat).

| Skill | Invocation | Audience |
|-------|------------|----------|
| `teacher-socratic` | Manual | Learners |
| `find-topics-graph` | Manual | Learners & authors |
| `review-course-project` | Manual | Learners |
| `create-course-module` | Manual | Authors |
| `generate-lesson-teacher` | Manual | Authors |
| `create-course-project` | Automatic or manual | Authors |
| `create-course-quiz` | Automatic or manual | Authors |

---

## Prompting tips

- **Be specific** — cite course, module, lesson, or project path when you know it
- **One intent per message** — learning, reviewing a delivery, and creating content are different flows
- **Attach the skill** — type `@` in Cursor and select the skill (e.g. `@teacher-socratic`), or write "use the skill `teacher-socratic`"
- **Manual skills** — always name the skill; the agent will not activate them from context alone
- **Do not ask for the full solution** when using `teacher-socratic` — that skill guides with questions and hints

---

## Skills for learners

### `teacher-socratic` — Socratic tutor

Helps you **learn concepts** through questions, diagrams, and a ladder of hints — without handing you the complete solution immediately.

**When to use:** theoretical questions, stuck on an exercise, want to understand *why* something works.

**Example prompts:**

```text
@teacher-socratic I'm on lesson 01.8.1 truthy vs falsy. Why is [] truthy?
```

```text
Use the teacher-socratic skill: I'm on project 001-cli-input-validator and don't
understand how to validate an empty string without using ==. Give me a hint, not the solution.
```

```text
@teacher-socratic Explain the event loop with a simple diagram before talking about microtasks.
```

---

### `find-topics-graph` — Locate topics in the graph

Searches [`graph/course.graph.txt`](../graph/course.graph.txt), shows prerequisites, children, and whether content already exists on disk.

**When to use:** "where do I learn X?", "what comes before Promises?", planning study order.

**Example prompts:**

```text
@find-topics-graph Where is "Async/Await" in the graph and which lessons exist on disk?
```

```text
Use find-topics-graph: list the subtopics of "03 Asynchronous JavaScript".
```

```text
@find-topics-graph What is the graphIndex for "Strict Equality" and which lesson corresponds?
```

---

### `review-course-project` — Review project delivery

Evaluates your implementation against the project README and lesson context. Produces a **score 0–100** and short feedback; score **> 80** marks the project as complete.

**When to use:** finished (or want partial feedback on) a PBL project.

**Example prompts:**

```text
@review-course-project Review my project at
course/javascript/modules/01-javascript-fundamentals/lessons/01.8.1-truthy-vs-falsy/projects/001-cli-input-validator
```

```text
Use the review-course-project skill to grade my latest delivery for project
001-cli-input-validator and save the review.
```

```text
@review-course-project Evaluate starter/index.js for project 019-access-gate-validator
and tell me what's missing to pass 80 points.
```

---

## Skills for content authors

If you maintain or expand the course (not just study it), use these skills.

### `create-course-module` — Scaffold module and empty lessons

Creates folder structure from the graph for an entire section (e.g. module `01`).

**Example prompt:**

```text
@create-course-module Scaffold module 02 Objects, References and Copying (dry-run first).
```

---

### `generate-lesson-teacher` — Generate lesson content

Creates or updates the explanation and project structure for **one** lesson, following [`COURSE_STRUCTURE.md`](../COURSE_STRUCTURE.md).

**Example prompt:**

```text
@generate-lesson-teacher Generate the predict-first explanation for lesson 01.4.2 Comparison Operators.
```

---

### `create-course-project` — Create PBL project

Scaffolds project folders, README with acceptance criteria, `starter/index.js`, and runs validation.

**Example prompts:**

```text
@create-course-project Create project 002 in lesson 01.8.2-strict-equality:
"Record Filter" — filter records with ===.
```

```text
Use create-course-project to validate all projects in lesson 01.6.1-for-loop.
```

---

### `create-course-quiz` — Create or update quiz

Produces schema-compliant quiz JSON aligned with the lesson README.

**Example prompts:**

```text
@create-course-quiz Create quiz.json for lesson 01.8.1-truthy-vs-falsy with 5 questions about falsy values.
```

```text
Use create-course-quiz to review the quiz for lesson 03.1.2-event-loop and add a question about output order.
```

---

## Useful commands

```bash
# Repo root — content pipeline and graph tests
npm test

# Regenerate catalog after editing course/
npm run catalog:generate

# Frontend development (from repo root)
npm run dev

# Frontend unit tests
cd frontend && npm test

# Individual test suites (from repo root)
npm run test:graph
npm run test:validate
npm run test:catalog
npm run test:integration
```

---

## Further reading

| Doc | Contents |
|-----|----------|
| [README](../README.md) | Project overview, harness + UI framing, audience sections |
| [COURSE_STRUCTURE.md](../COURSE_STRUCTURE.md) | Content hierarchy contract and folder layout |
| [frontend/ARCHITECTURE-FRONT.md](../frontend/ARCHITECTURE-FRONT.md) | Learner navigation journey in the UI |
| [frontend/ARCHITECTURE.md](../frontend/ARCHITECTURE.md) | Routes, layers, and score persistence |
| [docs/meta-schemas.md](meta-schemas.md) | `*.meta.json` schema reference |
| [.cursor/rules/course-hierarchy.mdc](../.cursor/rules/course-hierarchy.mdc) | Hierarchy rules for the Cursor Agent |
