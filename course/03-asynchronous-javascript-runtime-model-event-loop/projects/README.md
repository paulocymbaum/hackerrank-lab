# Projects — Asynchronous JavaScript: Runtime Model & Event Loop

## How to use
- Each topic lives in a folder `NN-.../`.
- Each exercise lives in a folder `NNN-.../` with `README.md`, `starter/`, and (optionally) `solution/`.
- Project numbers (`001`, `002`, …) are **sequential across the whole module**, not reset per topic.

## Recommended workflow
1. Open the project in the study UI (course → **Projects** tab → open project).
2. Read **Explanation**, browse **Folders/Files**, implement in `starter/`.
3. Run locally:

```bash
node starter/index.js
```

4. When done, use the **Delivery** tab to save your write-up (persisted as `project-delivery.json` in the project folder).

If `starter/index.js` doesn't exist yet, create it as your entrypoint.

## What you should practice in this module
- Predicting **output order** using the runtime model (call stack → microtasks → tasks).
- Building async utilities with clear invariants, retries, and backpressure.
- Separating scheduling from the call stack (no conflating stack with task queues).

## Topic catalog

### `01-event-loop-basics/`
- Focus: **predicting output order** using the runtime model (call stack → microtasks → tasks).
- Projects:
  - `001-output-order-predictor/`: build a small “predict-first” trainer that explains ordering without using `eval`.

### `02-promises-and-async/`
- Focus: **building reliable async utilities** with clear invariants and error handling.
- Projects:
  - `002-retry-with-backoff/`: retry an async operation with exponential backoff and stop conditions.
  - `003-concurrency-limiter/`: limit the number of in-flight async tasks (FIFO queue, no deadlocks).

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
