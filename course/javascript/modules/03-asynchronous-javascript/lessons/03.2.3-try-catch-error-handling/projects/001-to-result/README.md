# To Result

## Problem context
Callers often need a uniform result object instead of mixing `try/catch` at every await site.

## Goal
Implement `toResult(promise)` that never throws — it returns `{ ok: true, value }` on fulfillment or `{ ok: false, error }` on rejection.

## Lesson concepts practiced
- [ ] Promise rejections can be caught with `try/catch` around `await`
- [ ] `toResult` normalizes outcomes without throwing to callers
- [ ] Async errors propagate as Promise rejections

## Functional requirements
- [ ] Implement `async function toResult(promise)`:
  - [ ] On fulfillment: `{ ok: true, value }`
  - [ ] On rejection: `{ ok: false, error }` (keep the original error object)
- [ ] `main()` reads one line: `ok` or `fail`
  - [ ] `ok`: await `toResult(Promise.resolve(42))` — print `ok:42`
  - [ ] `fail`: await `toResult(Promise.reject(new Error("boom")))` — print `err:boom`

## Non-functional requirements
- [ ] `toResult` must use `try/catch` around `await`
- [ ] `main` must not throw on rejection path

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] Input `ok` → `ok:42`
- [ ] Input `fail` → `err:boom`
- [ ] `toResult` never throws

## Example data

Input:
- `ok`

Output:
- `ok:42`

## Suggested plan (no solution)
1. Implement `toResult` with try/catch around await.
2. Branch in `main` on stdin line.
3. Format output as `ok:<value>` or `err:<message>`.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support `toResult` on non-Promise values by wrapping with `Promise.resolve`.
