# Truthy Classifier

## Problem context
Business rules often misuse truthiness — treating valid `0` or `"0"` incorrectly. You need explicit `Boolean()` classification.

## Goal
Implement `classify(value)` returning `"truthy"` or `"falsy"` using `Boolean(value)`, and demonstrate one case where naive `if (value)` fails for valid data.

## Lesson concepts practiced
- [ ] Complete falsy list: `false`, `0`, `""`, `null`, `undefined`, `NaN`
- [ ] `"0"` and `[]` are truthy
- [ ] Falsy does not mean invalid (`0` can be valid)

## Functional requirements
- [ ] Implement `classify(value)` — return `"truthy"` or `"falsy"` via `Boolean(value)`.
- [ ] Implement `naiveGate(value)` — returns `"blocked"` if `!value`, else `"allowed"`.
- [ ] `main()` reads one JSON value per line until `done`:
  - [ ] Print `classify: <truthy|falsy>` for each value
  - [ ] For value `0`, also print `naiveGate: <allowed|blocked>` and `note: 0 is valid but falsy`
- [ ] Test values must include: `0`, `""`, `"0"`, `[]`, `null`, `" "` (space string)

## Non-functional requirements
- [ ] Use `Boolean()` in `classify`, not implicit `if (value)` coercion alone
- [ ] Clear output labels

## Constraints
- [ ] Node.js only
- [ ] Parse stdin lines as JSON values

## Acceptance criteria
- [ ] `0` → `classify: falsy` and `naiveGate: blocked` and note about valid zero
- [ ] `"0"` → `classify: truthy`
- [ ] `[]` → `classify: truthy`
- [ ] `""` → `classify: falsy`
- [ ] `" "` (space) → `classify: truthy`

## Example data

Input:
- `0`

Output:
- `classify: falsy`
- `naiveGate: blocked`
- `note: 0 is valid but falsy`

## Suggested plan (no solution)
1. Implement `classify` with `Boolean(value)`.
2. Implement `naiveGate` with `!value` to show the pitfall.
3. Parse JSON lines; special-case `0` for the note.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `explain(value)` printing which falsy rule applies.
