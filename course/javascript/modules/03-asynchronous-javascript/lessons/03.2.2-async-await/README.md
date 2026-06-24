# Async/Await

> Graph index: `03.2.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:03-asynchronous-javascript/03.2.2-async-await:README.md -->

## Context

`async`/`await` is syntax for working with Promises. An `async` function always returns a Promise; `await` pauses the function until a Promise settles, then resumes via a **microtask**.

## Predict first

What is the output order?

```js
async function main() {
  console.log("A");
  await null;
  console.log("B");
}

main();
console.log("C");
```

## Explanation

Sequential async steps:

```js
async function runSteps() {
  console.log(1);
  await Promise.resolve();
  console.log(2);
  await Promise.resolve();
  console.log(3);
}
```

`try/catch` around `await`:

```js
async function run() {
  try {
    await Promise.reject(new Error("boom"));
  } catch (e) {
    console.log("caught", e.message);
  }
}
```

## What to observe

- Code after `await` resumes later as a microtask.
- `await` on a rejection throws inside the async function; use `try/catch` to handle it.
- `main()` starts synchronously until the first `await`.

## Quick challenge

Write three `async` functions that must run in order using `await`. Make the second one throw; catch the error in a caller with `try/catch`.
