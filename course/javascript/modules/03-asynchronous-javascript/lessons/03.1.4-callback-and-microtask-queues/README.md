# Callback and Microtask Queues

> Graph index: `03.1.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:03-asynchronous-javascript/03.1.4-callback-and-microtask-queues:README.md -->

## Context

The event loop drains **microtasks** (Promise reactions) before running the next **task** (e.g. `setTimeout`). Understanding this ordering prevents "mystery" output when mixing Promises and timers.

## Predict first

What prints first: `micro` or `timer`?

```js
console.log("start");

Promise.resolve().then(() => console.log("micro"));
setTimeout(() => console.log("timer"), 0);

console.log("end");
```

## Explanation

Chaining microtasks:

```js
Promise.resolve()
  .then(() => console.log("m1"))
  .then(() => console.log("m2"));

setTimeout(() => console.log("t1"), 0);
```

Both `m1` and `m2` run before `t1` because the microtask queue is drained completely before the next task.

## What to observe

- Promise reactions are microtasks.
- Microtasks run to completion before the next task.
- `setTimeout(fn, 0)` does not mean "run immediately" — it means "schedule as a task after current sync + microtasks".

## Quick challenge

Add exactly one line of code so that `t1` prints before `m2` (hint: schedule work in a task).
