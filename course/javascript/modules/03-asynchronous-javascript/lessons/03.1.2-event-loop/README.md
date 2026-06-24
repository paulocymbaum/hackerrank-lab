# Event Loop

> Graph index: `03.1.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:03-asynchronous-javascript/03.1.2-event-loop:README.md -->

## Context

The **event loop** coordinates synchronous code, **microtasks** (Promise reactions), and **tasks** (timers, I/O callbacks). One useful mental model:

1. Run all synchronous code on the call stack.
2. Drain the microtask queue completely.
3. Run one task from the task queue.
4. Repeat.

## Predict first

What prints, and in what order?

```js
console.log("start");

Promise.resolve().then(() => console.log("micro"));
setTimeout(() => console.log("timer"), 0);

console.log("end");
```

## Explanation

Promise `.then` callbacks are **microtasks**. `setTimeout` schedules a **task**. After sync code finishes (`start`, `end`), microtasks run before the next task.

```js
console.log("A");
Promise.resolve().then(() => console.log("B"));
setTimeout(() => console.log("C"), 0);
console.log("D");
```

Expected order: `A`, `D`, `B`, `C`.

## What to observe

- Microtasks (Promise reactions) run before timers with `0` delay.
- Label each log as **sync**, **microtask**, or **task** when predicting order.
- `async/await` resumes via microtasks — covered in later lessons.

## Quick challenge

For the first example, list each `console.log` and classify it as sync, microtask, or task. Write the final order without running the code.
