# Data Normalizer

## Problem context
You receive user records from multiple sources. Some fields come as numbers, some as strings, and missing values are inconsistent (`null`, `undefined`, empty string).

## Goal
Write a function that **normalizes** a record into a consistent shape, using explicit conversions and predictable rules.

## Functional requirements
- [ ] Implement `normalizeRecord(record)` that returns a new object (do not mutate input).
- [ ] Inputs may contain:
  - [ ] `id`: string or number (required)
  - [ ] `age`: string/number/null/undefined (optional; may be `0`)
  - [ ] `email`: string/null/undefined (optional)
  - [ ] `isActive`: boolean/string/null/undefined (optional)
- [ ] Normalization rules:
  - [ ] `id`: convert to `String(id)` and trim.
  - [ ] `age`: if nullish -> `null`; otherwise convert via `Number(...)` and if not finite -> error.
  - [ ] `email`: if nullish -> `null`; otherwise trim; if empty after trim -> `null`.
  - [ ] `isActive`: accept `true/false` booleans, or strings `"true"`/`"false"` (case-insensitive). Nullish -> `null`. Anything else -> error.

## Non-functional requirements
- [ ] Clear errors (include which field failed)
- [ ] No reliance on loose equality for correctness

## Constraints
- [ ] No external libraries
- [ ] Use `Number.isFinite` and `Number.isNaN` as needed

## Acceptance criteria
- [ ] `age: 0` remains `0` (not treated as missing)
- [ ] `email: "   "` becomes `null`
- [ ] `isActive: "FALSE"` becomes `false`
- [ ] Bad numeric values produce an error (e.g. `"abc"` for age)

## Example data

Input:

```js
normalizeRecord({ id: 10, age: "0", email: "  a@b.com ", isActive: "TRUE" })
```

Output:

```js
{ id: "10", age: 0, email: "a@b.com", isActive: true }
```

## Suggested plan (no solution)
1. Decide which fields are allowed to become `null` vs must throw.
2. Normalize each field with explicit checks: nullish (`== null`) vs empty string.
3. Return a brand-new object.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `normalizeMany(records)` that returns `{ ok: normalized[], errors: [...] }` without throwing.
