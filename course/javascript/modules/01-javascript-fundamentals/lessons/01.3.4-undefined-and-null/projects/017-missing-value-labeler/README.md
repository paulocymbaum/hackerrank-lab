# Optional Field Describer

## Problem context
Optional profile fields use real JavaScript `undefined` and `null` — not the strings `"undefined"` or `"null"`.

## Goal
Implement `describeField(value)` that labels actual nullish values and real data using strict equality checks.

## Lesson concepts practiced
- [ ] `undefined` means not assigned / not provided
- [ ] `null` means intentionally empty
- [ ] Use `=== undefined` and `=== null`, not `typeof` for null

## Functional requirements
- [ ] Implement `describeField(value)`:
  - [ ] `undefined` → `"not provided"`
  - [ ] `null` → `"explicitly empty"`
  - [ ] any other value → `"has value: " + String(value)`
- [ ] `main()` reads one JSON value per line until `done`; prints one description per line.
- [ ] Must work with real JS values from `JSON.parse` (`null`) and a sentinel for undefined (line `undefined` parsed as JS undefined via special case: empty line after trim → `undefined`).

## Non-functional requirements
- [ ] Use `===` for null and undefined checks
- [ ] Do not compare to strings `"undefined"` or `"null"`

## Constraints
- [ ] Node.js only
- [ ] Line containing only `undefined` (text) maps to JS `undefined`; `null` JSON maps to JS `null`

## Acceptance criteria
- [ ] `undefined` input → `not provided`
- [ ] `null` input → `explicitly empty`
- [ ] `"Ana"` → `has value: Ana`
- [ ] `""` → `has value: ` (empty string is a real value, not nullish)
- [ ] `0` → `has value: 0`

## Example data

Input:
- `null`

Output:
- `explicitly empty`

## Suggested plan (no solution)
1. Parse line: if text is `undefined`, use JS undefined; else `JSON.parse`.
2. Branch with `=== undefined`, `=== null`, else format value.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept objects with missing keys and describe `obj.nickname` as `not provided`.
