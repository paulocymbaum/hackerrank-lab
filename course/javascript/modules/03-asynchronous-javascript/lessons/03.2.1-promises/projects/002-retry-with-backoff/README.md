# Retry With Backoff

## Problem context
Your application calls an unreliable API. Sometimes it fails due to transient errors. You want retries, but you also want to avoid hammering the server.

## Goal
Implement a `retry` utility that retries an async function with **exponential backoff** and clear error rules.

## Functional requirements
- [ ] Implement `retry(fn, options)` where:
  - [ ] `fn` is a function returning a promise
  - [ ] `options.retries` (default `3`)
  - [ ] `options.baseDelayMs` (default `100`)
  - [ ] `options.factor` (default `2`)
  - [ ] `options.shouldRetry(error)` (optional predicate)
- [ ] Behavior:
  - [ ] Call `fn` until it succeeds OR retries are exhausted.
  - [ ] Between attempts, wait `baseDelayMs * factor^(attempt-1)` milliseconds.
  - [ ] If `shouldRetry` returns false, fail immediately.
- [ ] Return the successful value, or throw the last error.

## Non-functional requirements
- [ ] Readable implementation (small helpers like `sleep(ms)` allowed)
- [ ] Deterministic tests/examples (use predictable fake failures)

## Constraints
- [ ] No external libraries

## Acceptance criteria
- [ ] Retries happen with increasing delay.
- [ ] `shouldRetry` can stop retries early.
- [ ] Errors propagate correctly when retries are exhausted.

## Example data

```js
let count = 0;
const fn = async () => {
  count++;
  if (count < 3) throw new Error("temporary");
  return "ok";
};

const result = await retry(fn, { retries: 5, baseDelayMs: 10 });
console.log(result); // ok
```

## Suggested plan (no solution)
1. Define `sleep(ms)` returning a promise.
2. Loop attempts, using `try/catch` around `await fn()`.
3. Decide when to stop (retries exhausted or `shouldRetry` false).
4. Await the computed delay before the next attempt.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add jitter to the delay.
- [ ] Add a max delay cap.
