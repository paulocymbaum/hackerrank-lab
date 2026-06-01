<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:03-asynchronous-javascript-runtime-model-event-loop:README.md -->

# Asynchronous JavaScript: Runtime Model & Event Loop

This module is a **3-tier lesson** that explains how JavaScript can feel “asynchronous” while still running on a **single thread**. You’ll learn to predict output order, debug timing issues, and build reliable async utilities.

## Tier 1 — Beginner: Sync vs Async (mental model)

### What “synchronous” means
Synchronous code runs **top to bottom**, one line after the next, on the **call stack**.

### What “asynchronous” means (in JavaScript)
In JS, “async” usually means:
- work is **scheduled** to run later (timers, I/O), or
- code continues while a result will arrive later (promises).

Important: async is about **scheduling**, not “running in parallel” (most JS code is still single-threaded).

### Key concepts
- **Call stack**: where synchronous functions run.
- **Web APIs / Node APIs**: timers, network, filesystem, etc.
- **Task queue (macro-task queue)**: scheduled callbacks like `setTimeout`.
- **Microtask queue**: promise reactions (`.then`, `catch`, `finally`) and `queueMicrotask`.
- **Event loop**: the coordinator that moves queued work onto the call stack.

### Predict-first snippet

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
```

Expected: `A`, `C`, then `B`.

### Beginner checklist
- [ ] I can explain “single-threaded execution” in one sentence.
- [ ] I can predict why `setTimeout(..., 0)` runs later.

## Tier 2 — Intermediate: Event loop, tasks vs microtasks

### Runtime model (a practical picture)
1. Run synchronous code until the call stack is empty.
2. Drain **microtasks** (promise reactions) until empty.
3. Take one **task** (timer/I/O callback) and run it.
4. Repeat.

### Microtasks often run before timers

```js
console.log("A");

Promise.resolve().then(() => console.log("micro"));
setTimeout(() => console.log("timer"), 0);

console.log("B");
```

Typical output: `A`, `B`, `micro`, `timer`.

### Why this matters
- “Why did my `.then(...)` run before my `setTimeout`?”
- “Why does my UI freeze if I do heavy work in one tick?”

### Debugging technique: trace the queue
When stuck, add logs at:
- sync boundary (`console.log` before/after scheduling)
- inside microtask (`.then` / `queueMicrotask`)
- inside timer callback

### Intermediate checklist
- [ ] I can explain tasks vs microtasks.
- [ ] I can predict output order in mixed snippets.

## Tier 3 — Advanced: Promises, async/await, errors, and invariants

### `async/await` is promise-based
An `async function` always returns a **promise**.

```js
async function f() {
  return 1;
}

f().then(console.log); // 1
```

`await` pauses *within the async function* and resumes later (via microtasks).

### Error flow
- Throwing inside an async function rejects the returned promise.
- `try/catch` around `await` catches rejections.

```js
async function run() {
  try {
    await Promise.reject(new Error("boom"));
  } catch (e) {
    console.log("caught", e.message);
  }
}
```

### Concurrency vs parallelism
- **Concurrency**: multiple async operations “in flight”.
- **Parallelism**: actually running at the same time on multiple CPU cores.

In JS, you often get concurrency (I/O overlap), not CPU parallelism.

### Designing reliable async utilities
When you write things like retry logic or concurrency limiters, be explicit about:
- **invariants** (what must always be true)
- **error handling** (what fails fast vs what is retried)
- **timeouts** and **cancellation** (what happens when you stop waiting)

### Advanced checklist
- [ ] I know that `await` resumes via microtasks.
- [ ] I can explain why `async` functions return promises.
- [ ] I can design a concurrency limiter with clear invariants.

## Common pitfalls
- Using `forEach(async () => ...)` and expecting it to await.
- Mixing `||` defaults with values like `0` (prefer `??` when nullish).
- Forgetting to `return` a promise chain.

## Self-test (Tiered)

### Tier 1
Predict output:

```js
console.log(1);
setTimeout(() => console.log(2), 0);
console.log(3);
```

### Tier 2

```js
console.log("start");
Promise.resolve().then(() => console.log("then"));
setTimeout(() => console.log("timeout"), 0);
console.log("end");
```

### Tier 3

```js
async function main() {
  console.log("A");
  await null;
  console.log("B");
}

main();
console.log("C");
```
