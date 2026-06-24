<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:03-asynchronous-javascript-runtime-model-event-loop:examples/03-promises-async-await-and-error-flow.md -->

# Tier 3 — Promises, Async/Await, and Error Flow

## Goal
Understand what async/await compiles down to conceptually: promise + microtask resumption.

## Example: await resumes later

```js
async function main() {
  console.log("A");
  await null;
  console.log("B");
}

main();
console.log("C");
```

### Predict
What is the output order?

## Example: error propagation

```js
async function run() {
  try {
    await Promise.reject(new Error("boom"));
  } catch (e) {
    console.log("caught", e.message);
  }
}

run();
```

### What to observe
- throwing/rejecting inside an async function rejects its returned promise.
- `try/catch` around `await` catches rejections.

## Mini-exercise
Write a function `toResult(promise)` that returns a promise resolving to `{ ok: true, value }` or `{ ok: false, error }`.
