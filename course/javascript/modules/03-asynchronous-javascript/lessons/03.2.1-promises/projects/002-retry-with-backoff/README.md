# Promise Chain Builder

## Problem context
Legacy callback APIs are still common in Node.js. Your team wraps them in Promises and chains `.then` / `.catch` for readable async flow.

## Goal
Implement `runPipeline()` that wraps a callback-style function in a `new Promise`, chains two `.then` handlers, and handles rejection with `.catch`.

## Lesson concepts practiced
- [ ] Create a Promise with `new Promise((resolve, reject) => ...)`
- [ ] Chain `.then` for fulfilled values
- [ ] Handle rejection with `.catch`

## Functional requirements
- [ ] Implement `fakeRead(path, callback)` — calls `callback(null, "data:" + path)` on next tick via `setTimeout(..., 0)`.
- [ ] Implement `readAsPromise(path)` — wrap `fakeRead` in `new Promise`; reject if `err`, else resolve `data`.
- [ ] Implement `runPipeline(path)`:
  - [ ] Call `readAsPromise(path)`
  - [ ] First `.then`: append `" -> parsed"`
  - [ ] Second `.then`: append `" -> done"`
  - [ ] `.catch`: return `"ERROR: " + err.message`
- [ ] `main()` reads one path line from stdin and prints the final string.

## Non-functional requirements
- [ ] Use Promise chaining (not async/await)
- [ ] Readable helper names

## Constraints
- [ ] Node.js only
- [ ] No external libraries
- [ ] Do not use async/await in the solution

## Acceptance criteria
- [ ] Input `users.json` prints `data:users.json -> parsed -> done`
- [ ] If `fakeRead` is called with path `fail`, it calls `callback(new Error("not found"))` — pipeline prints `ERROR: not found`
- [ ] `readAsPromise` uses `new Promise`, not `Promise.resolve` alone

## Example data

Input:
- `users.json`

Output:
- `data:users.json -> parsed -> done`

## Suggested plan (no solution)
1. Write `fakeRead` with setTimeout and callback convention.
2. Wrap in `new Promise` inside `readAsPromise`.
3. Chain two `.then` transforms in `runPipeline`.
4. Wire stdin in `main`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `.finally` that logs `pipeline finished`.
