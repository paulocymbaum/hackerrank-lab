<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:03-asynchronous-javascript-runtime-model-event-loop:examples/02-event-loop-microtasks-vs-tasks.md -->

# Tier 2 — Event Loop: Microtasks vs Tasks

## Goal
Learn the core ordering rule:
- run sync
- drain microtasks
- run one task
- repeat

## Example: Promise vs timer

```js
console.log("start");

Promise.resolve().then(() => console.log("micro"));
setTimeout(() => console.log("timer"), 0);

console.log("end");
```

### Predict
What prints first: `micro` or `timer`?

## Example: chaining microtasks

```js
Promise.resolve()
  .then(() => console.log("m1"))
  .then(() => console.log("m2"));

setTimeout(() => console.log("t1"), 0);
```

### What to observe
- Promise reactions are microtasks.
- Microtasks run to completion before the next task.

## Mini-exercise
Add exactly one line so that `t1` prints before `m2` (hint: schedule work in a task).
