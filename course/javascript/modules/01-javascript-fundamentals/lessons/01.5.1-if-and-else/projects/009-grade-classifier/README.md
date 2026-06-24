# Grade Classifier

## Problem context
A learning platform maps numeric scores to letter grades. Rules must be explicit — no off-by-one bugs at boundaries.

## Goal
Read one score from `stdin` and print the letter grade using `if` / `else if` / `else`.

## Functional requirements
- [ ] Read one line `score` (0–100 integer).
- [ ] Invalid input → `ERROR: invalid score` (single line).
- [ ] Grading rules:
  - [ ] `90–100` → `A`
  - [ ] `80–89` → `B`
  - [ ] `70–79` → `C`
  - [ ] `60–69` → `D`
  - [ ] `0–59` → `F`
- [ ] Print `Grade: <letter>` on success.

## Non-functional requirements
- [ ] Boundaries inclusive on lower bound (e.g. 90 is `A`)
- [ ] Readable branch structure

## Constraints
- [ ] Node.js only
- [ ] Score must be integer in range 0–100

## Acceptance criteria
- [ ] `90` → `Grade: A`
- [ ] `89` → `Grade: B`
- [ ] `59` → `Grade: F`
- [ ] `-1` or `101` or `abc` → error

## Example data

Input:
- `84`

Output:
- `Grade: B`

## Suggested plan (no solution)
1. Parse score with `Number()`; check `Number.isInteger` and range.
2. Chain `if / else if` from highest threshold down.
3. Print labeled result.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `Grade: A+` for scores `>= 97`.
