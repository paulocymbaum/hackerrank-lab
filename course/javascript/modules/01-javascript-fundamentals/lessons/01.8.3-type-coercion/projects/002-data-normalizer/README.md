# Coercion Predictor

## Problem context
Loose equality `==` surprises teams in code review. You practice predicting coercion before choosing `===`.

## Goal
Read two JSON values and an operator (`==` or `===`), print the comparison result and a one-line coercion rule.

## Lesson concepts practiced
- [ ] `==` may coerce types before comparing
- [ ] `===` compares type and value without coercion
- [ ] Cases like `"" == 0`, `[] == 0`, `null == undefined`

## Functional requirements
- [ ] Read 3 lines: JSON value `a`, operator (`==` or `===`), JSON value `b`.
- [ ] Print `result: true` or `result: false`.
- [ ] Print `rule: <one line explaining coercion or lack thereof>`.
- [ ] Hardcode rule text for known lesson cases:
  - [ ] `"" == 0` → mentions empty string coerces to 0
  - [ ] `[] == 0` → mentions array coerces to 0
  - [ ] `null == undefined` → true with `==`, false with `===`
- [ ] Invalid operator → `ERROR: invalid operator`

## Non-functional requirements
- [ ] Use actual `==` or `===` for the result (do not hardcode only the boolean)
- [ ] Rule text must match the operator used

## Constraints
- [ ] Node.js only
- [ ] Parse `a` and `b` with `JSON.parse`

## Acceptance criteria
- [ ] `""`, `==`, `0` → `result: true` and rule mentions coercion
- [ ] `[]`, `==`, `0` → `result: true`
- [ ] `null`, `===`, `undefined` → `result: false`
- [ ] `null`, `==`, `undefined` → `result: true`

## Example data

Input:
- `""`
- `==`
- `0`

Output:
- `result: true`
- `rule: empty string coerces to 0 with ==`

## Suggested plan (no solution)
1. Parse three stdin lines.
2. Evaluate `a op b` with the chosen operator.
3. Map known pairs to rule strings; fallback generic rule for `===`.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `!=` and `!==` support.
