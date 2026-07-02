# Commented Validator

## Problem context
Maintainable validators document each rule with comments explaining **why**, not just what.

## Goal
Implement a three-rule name/score validator where each rule has a `//` comment in source code, and one rule is disabled via a commented-out line.

## Lesson concepts practiced
- [ ] Single-line `//` comments are ignored by the engine
- [ ] Comments explain why, not obvious code
- [ ] Commenting out a line disables that check

## Functional requirements
- [ ] Read two lines: `name`, `score`.
- [ ] Validate with three rules in `validate(name, score)`:
  - [ ] Rule 1 (comment: name must not be empty after trim) — active
  - [ ] Rule 2 (comment: score must be 0–100) — **disabled** by commenting out the check line
  - [ ] Rule 3 (comment: name must be at least 2 chars after trim) — active
- [ ] Each rule check must have an adjacent `//` comment in the source citing the rule.
- [ ] On failure print `ERROR: <rule message>`; on success `OK`.
- [ ] With rule 2 disabled, `score` of `200` still prints `OK` if name passes.

## Non-functional requirements
- [ ] At least three `//` comments in `validate` tied to rules
- [ ] One validation line must be commented out with `//`

## Constraints
- [ ] Node.js only
- [ ] Comments must appear in `starter/index.js` (not only stdout)

## Acceptance criteria
- [ ] `Ana`, `200` → `OK` (score rule disabled)
- [ ] ` `, `50` → `ERROR: name is required`
- [ ] `A`, `50` → `ERROR: name too short`
- [ ] Source file contains commented-out score range check

## Example data

Input:
- `Ana`
- `200`

Output:
- `OK`

## Suggested plan (no solution)
1. Write `validate` with three commented rule blocks.
2. Comment out the score range `if` body or condition.
3. Wire stdin in `main`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Re-enable rule 2 via config flag instead of comment.
