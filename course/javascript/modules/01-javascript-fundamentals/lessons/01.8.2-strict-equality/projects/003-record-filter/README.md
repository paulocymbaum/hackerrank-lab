# Equality Judge

## Problem context
Code review needs side-by-side `==` vs `===` results to justify strict equality in validation code.

## Goal
Read two JSON values and print loose vs strict comparison results plus a recommendation.

## Lesson concepts practiced
- [ ] `===` compares type and value without coercion
- [ ] `==` may coerce (`"" == 0`, `[] == 0`)
- [ ] `{} == {}` is false (different references)

## Functional requirements
- [ ] Read two lines, parse each as JSON → `a`, `b`.
- [ ] Print `loose: <a == b>`
- [ ] Print `strict: <a === b>`
- [ ] Print `prefer: ===` when results differ, else `prefer: either (same result)`
- [ ] Include hardcoded demo mode: if input lines are `demo`, run lesson pairs:
  - [ ] `[]` and `0`
  - [ ] `{}` and `{}` (two separate object literals in code, not from stdin)

## Non-functional requirements
- [ ] Use actual `==` and `===` operators
- [ ] Clear labels

## Constraints
- [ ] Node.js only
- [ ] `demo` mode prints at least 2 pairs

## Acceptance criteria
- [ ] `[]` and `0` → `loose: true`, `strict: false`, `prefer: ===`
- [ ] `0` and `0` → `loose: true`, `strict: true`, `prefer: either (same result)`
- [ ] Demo `{}` vs `{}` → `loose: false`, `strict: false`
- [ ] `null` and `undefined` → `loose: true`, `strict: false`

## Example data

Input:
- `[]`
- `0`

Output:
- `loose: true`
- `strict: false`
- `prefer: ===`

## Suggested plan (no solution)
1. Parse two JSON values.
2. Print loose, strict, and preference line.
3. Optional `demo` branch for `{}` identity case.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print coercion hint for loose-true strict-false pairs.
