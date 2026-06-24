# Boundary Checker

## Problem context
Form validators must confirm a numeric answer sits inside an inclusive min/max range. Off-by-one bugs at boundaries are common without explicit `>=` and `<=` checks.

## Goal
## Lesson concepts practiced
- [ ] Use `===` and `!==` unless you explicitly need coercion.
- [ ] Boundary bugs are common: decide whether limits are inclusive (`>=`, `<=`).
- [ ] Comparisons return booleans — store them in variables like `isValid`.

Read `value`, `min`, and `max` and print whether the value is inside the inclusive range.

## Functional requirements
- [ ] Read three finite numbers: `value`, `min`, `max` (one per line).
- [ ] Invalid number on any line → `ERROR: invalid number`.
- [ ] If `min > max` → `ERROR: invalid range`.
- [ ] Inclusive check: `value >= min && value <= max`.
- [ ] Print `IN RANGE` or `OUT OF RANGE` (exact casing).

## Non-functional requirements
- [ ] Use strict parsing with `Number()` and `Number.isFinite`
- [ ] Store `inRange` in a boolean variable

## Constraints
- [ ] Node.js only
- [ ] Boundaries are inclusive on both ends

## Acceptance criteria
- [ ] `90`, `0`, `100` → `IN RANGE`
- [ ] `90`, `0`, `89` → `OUT OF RANGE`
- [ ] `90`, `90`, `100` → `IN RANGE` (lower bound inclusive)
- [ ] `10`, `20`, `10` → `ERROR: invalid range`

## Example data

Input:
- `89`
- `0`
- `100`

Output:
- `IN RANGE`

## Suggested plan (no solution)
1. Read and parse three numbers.
2. Validate `min <= max`.
3. Compare with `>=` and `<=`; print result label.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print which boundary failed when out of range.
