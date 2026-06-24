# Single-Threaded Execution

> Graph index: `03.1.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:03-asynchronous-javascript/03.1.1-single-threaded-execution:README.md -->

## Context

JavaScript runs on a **single thread**. Synchronous code runs to completion on the call stack before anything scheduled for later can start. `setTimeout` and similar APIs **schedule** work — they do not run it immediately.

## Predict first

What prints, and in what order?

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
```

## Explanation

When `setTimeout` is called, the callback is queued for later. The engine finishes all synchronous lines first (`A`, then `C`), then processes scheduled callbacks.

Nested scheduling:

```js
console.log(1);
setTimeout(() => {
  console.log(2);
  setTimeout(() => console.log(3), 0);
}, 0);
console.log(4);
```

`3` cannot print before `2` because the inner timer is scheduled only after the outer callback runs.

## What to observe

- Synchronous `console.log` always runs before any `setTimeout` callback, even with delay `0`.
- `setTimeout` schedules a callback; it does not pause the current line.
- Reading code "like the runtime" means marking what runs **now** vs what is **scheduled for later**.

## Quick challenge

Trace the call stack for the nested example above. Why must `4` print before `2`?
