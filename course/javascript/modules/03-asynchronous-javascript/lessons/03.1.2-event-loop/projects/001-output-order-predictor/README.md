# Output Order Predictor

## Problem context
Your team keeps getting "mystery" output orders when mixing synchronous code, timers, and promises. You need a repeatable way to practice reasoning about the event loop.

## Goal
Build a program that analyzes predefined snippets and prints the expected output order, classifying each log as **sync**, **microtask**, or **task**.

## Lesson concepts practiced
- [ ] Run sync code before microtasks and tasks
- [ ] Promise `.then` callbacks are microtasks
- [ ] `setTimeout(..., 0)` schedules a task that runs after microtasks drain

## Functional requirements
- [ ] Provide at least 4 predefined snippets (as data, not `eval`):
  - [ ] Each snippet must include at least one sync log, one `Promise.resolve().then(...)`, and one `setTimeout(..., 0)`
  - [ ] At least one snippet includes `async/await`
- [ ] For each snippet, print:
  - [ ] Snippet name
  - [ ] Expected output order on one line (space-separated labels)
  - [ ] Per-log classification: `label:sync|microtask|task`
  - [ ] A 2–4 line explanation using: call stack, microtask queue, task queue
- [ ] Include snippet `trick` where microtasks run before timers.

## Non-functional requirements
- [ ] Readable structure (e.g. `explainSnippet(snippet)` helper)
- [ ] Do not execute snippets with `eval`

## Constraints
- [ ] Node.js only (no external libraries)
- [ ] Reasoning practice only — hardcode correct answers from event loop rules

## Acceptance criteria
- [ ] Snippet `basic`: `A B micro timer` order for sync + Promise + setTimeout pattern from the lesson
- [ ] Every log line in every snippet has an explicit sync/microtask/task label
- [ ] `trick` snippet explanation states microtasks drain before the next task
- [ ] At least 4 snippets printed when `main()` runs

## Example data

Snippet `basic`:

```js
console.log("A");
Promise.resolve().then(() => console.log("micro"));
setTimeout(() => console.log("timer"), 0);
console.log("B");
```

Expected output includes:
- Order: `A B micro timer`
- Classifications: `A:sync`, `B:sync`, `micro:microtask`, `timer:task`

## Suggested plan (no solution)
1. Define snippet objects with `name`, `code`, `order`, `classifications`, `explanation`.
2. Loop snippets and print formatted results.
3. Verify `basic` matches lesson "Predict first" example.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a fifth snippet with chained `.then` microtasks before a timer.
