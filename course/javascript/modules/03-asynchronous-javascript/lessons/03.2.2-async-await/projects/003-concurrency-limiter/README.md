# Sequential Async Runner

## Problem context
A CLI tool runs setup steps in order. Each step is async. One step can fail and must be caught without crashing the process.

## Goal
Implement three async steps that run sequentially with `await`, with `try/catch` around the sequence.

## Lesson concepts practiced
- [ ] `async` functions and `await` pause until a Promise settles
- [ ] Code after `await` resumes as a microtask
- [ ] `try/catch` around `await` catches rejections

## Functional requirements
- [ ] Implement `delay(ms, label)` — returns a Promise that resolves to `label` after `ms` milliseconds.
- [ ] Implement `stepFetch()` — `await delay(10, "fetch:ok")`.
- [ ] Implement `stepTransform()` — `await delay(10, "transform:ok")`.
- [ ] Implement `stepSave(shouldFail)` — if `shouldFail`, `throw new Error("save failed")`; else `await delay(10, "save:ok")`.
- [ ] Implement `runPipeline(shouldFail)`:
  - [ ] `try`: await `stepFetch`, then `stepTransform`, then `stepSave(shouldFail)`; return the three results joined with ` | `
  - [ ] `catch`: return `ERROR: <message>`
- [ ] `main()` reads one line: `ok` or `fail`; prints pipeline result.

## Non-functional requirements
- [ ] Steps must run in order (fetch before transform before save)
- [ ] Use `async`/`await` (not raw `.then` chains)

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] Input `ok` prints `fetch:ok | transform:ok | save:ok`
- [ ] Input `fail` prints `ERROR: save failed`
- [ ] `stepFetch` completes before `stepTransform` starts (sequential await)

## Example data

Input:
- `ok`

Output:
- `fetch:ok | transform:ok | save:ok`

## Suggested plan (no solution)
1. Write `delay` with `setTimeout` + `Promise`.
2. Implement three async step functions.
3. Wrap sequential awaits in `try/catch` inside `runPipeline`.
4. Read stdin in `main`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Log each step start time to verify ordering.
