<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:03-asynchronous-javascript-runtime-model-event-loop:examples/01-sync-vs-async-trace.md -->

# Tier 1 — Sync vs Async: Tracing the Call Stack

## Goal
Practice reading code like the runtime: what runs now, what is scheduled for later.

## Example 1: basic timer

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
```

### Predict
Write the output order.

### What to observe
- `setTimeout` schedules a callback; it does not run it immediately.
- The synchronous lines run first.

## Example 2: nested scheduling

```js
console.log(1);
setTimeout(() => {
  console.log(2);
  setTimeout(() => console.log(3), 0);
}, 0);
console.log(4);
```

### Mini-exercise
Explain why `3` cannot print before `2`.
