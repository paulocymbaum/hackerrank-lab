# Projects — Asynchronous JavaScript: Runtime Model & Event Loop

## How to use
- Each topic lives in a folder `NN-.../`.
- Each exercise lives in a folder `NNN-.../` with:
  - `README.md` (problem statement + acceptance criteria)
  - `starter/` (your implementation)
  - `solution/` (optional reference)

## Recommended workflow
1. Open the project `README.md`.
2. Implement your solution in `starter/`.
3. Run with Node:

```bash
node starter/index.js
```

If a project doesn’t include `starter/index.js` yet, create it as your entrypoint.

## What each topic trains

### `01-event-loop-basics/`
- Focus: **predicting output order** using the runtime model (call stack → microtasks → tasks).
- Project:
  - `001-output-order-predictor/`: build a small “predict-first” trainer that explains ordering without using `eval`.

### `02-promises-and-async/`
- Focus: **building reliable async utilities** with clear invariants and error handling.
- Projects:
  - `002-retry-with-backoff/`: retry an async operation with exponential backoff and stop conditions.
  - `003-concurrency-limiter/`: limit the number of in-flight async tasks (FIFO queue, no deadlocks).
