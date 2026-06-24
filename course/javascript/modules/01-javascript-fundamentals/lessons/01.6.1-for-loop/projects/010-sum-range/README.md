# Sum Range

## Problem context
Analytics needs the sum of all integers from `start` to `end` inclusive. A `for` loop is the straightforward tool.

## Goal
## Lesson concepts practiced
- [ ] Off-by-one bugs are common: `i < n` vs `i <= n`.
- [ ] Apply concepts from for Loop
- [ ] Match acceptance criteria to lesson examples

Read `start` and `end` from `stdin` and print the inclusive sum.

## Functional requirements
- [ ] Read two integers `start` and `end` (may be negative; `start` may be greater than `end`).
- [ ] Invalid input → `ERROR: invalid range` (one line).
- [ ] Use a `for` loop to accumulate the sum.
- [ ] Print `Sum: <total>` on success.

## Non-functional requirements
- [ ] Loop bounds correct when `start > end` (sum should be `0` or swap logic — document: use min/max)
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Must use `for` (not `while` or formulas) for practice

## Acceptance criteria
- [ ] `1` and `5` → `Sum: 15` (1+2+3+4+5)
- [ ] `5` and `1` → `Sum: 15` (same inclusive range)
- [ ] `3` and `3` → `Sum: 3`
- [ ] Non-integer input → error

## Example data

Input:
- `1`
- `4`

Output:
- `Sum: 10`

## Suggested plan (no solution)
1. Parse integers; validate.
2. Set `low = Math.min(start, end)`, `high = Math.max(start, end)`.
3. `let sum = 0`; loop `i` from `low` to `high`; add each `i`.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print how many iterations ran.
