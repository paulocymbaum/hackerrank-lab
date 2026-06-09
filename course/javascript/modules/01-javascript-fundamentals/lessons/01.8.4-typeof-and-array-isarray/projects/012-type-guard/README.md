# Type Guard

## Problem context
API payloads mix strings, numbers, arrays, and plain objects. `typeof` alone is misleading (`typeof null === "object"`). You need safe runtime checks.

## Goal
Implement `describeValue(value)` that returns a human-readable type label using `typeof` and `Array.isArray`.

## Functional requirements
- [ ] Return `"null"` when `value === null` (do not rely on `typeof`).
- [ ] Return `"array"` when `Array.isArray(value)`.
- [ ] Return `"number"` only for finite numbers (`Number.isFinite`).
- [ ] Return `"NaN"` when `typeof value === "number"` but not finite.
- [ ] Otherwise return `typeof value` as string (`"string"`, `"boolean"`, `"undefined"`, `"object"`, etc.).

## Non-functional requirements
- [ ] Check `null` before `typeof`
- [ ] Check `Array.isArray` before generic `object`

## Constraints
- [ ] No external libraries
- [ ] Export `describeValue` from `starter/index.js`

## Acceptance criteria
- [ ] `describeValue(null)` → `"null"`
- [ ] `describeValue([])` → `"array"`
- [ ] `describeValue(NaN)` → `"NaN"`
- [ ] `describeValue("x")` → `"string"`
- [ ] `describeValue({})` → `"object"`

## Example data

```js
describeValue([1, 2]); // "array"
describeValue(null);   // "null"
describeValue(0);      // "number"
```

## Suggested plan (no solution)
1. Handle `value === null` first.
2. Then `Array.isArray(value)`.
3. Then numbers with `Number.isFinite` vs `NaN`.
4. Fall back to `typeof value`.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Return `"integer"` for whole numbers.
