# Promises

> Graph index: `03.2.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:03-asynchronous-javascript/03.2.1-promises:README.md -->

## Context

A **Promise** represents a value that may be available later. You create one with `new Promise(executor)`, then chain `.then` for success and `.catch` for failure. Promise reactions are **microtasks**.

## Predict first

What does this print?

```js
const p = new Promise((resolve) => {
  resolve(42);
});

p.then((value) => console.log("got", value));
console.log("after");
```

## Explanation

Creating a Promise from a callback:

```js
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(ms), ms);
  });
}

delay(100).then((ms) => console.log("waited", ms));
```

Rejection and `.catch`:

```js
Promise.reject(new Error("boom"))
  .catch((err) => console.log("caught", err.message));
```

## What to observe

- `resolve` and `reject` are called inside the executor; `.then` runs later as a microtask.
- `.catch` handles rejections in the chain.
- A Promise can be pending, fulfilled, or rejected.

## Quick challenge

Wrap `readFile`-style callback `(err, data) => ...` in a `new Promise` that resolves with `data` or rejects with `err`.
