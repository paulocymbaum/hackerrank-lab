# Input Validator

## Problem context

Forms reject bad usernames. Empty strings and whitespace-only values must fail; valid names pass.

## Goal

Implement `isValidUsername(value)` using truthiness and `===`, and test cases from `main()`.

## Functional requirements

- [ ] Empty string `""` → false
- [ ] Whitespace-only `"   "` → false (use `trim`)
- [ ] Non-empty trimmed string → true
- [ ] `null` / `undefined` → false
- [ ] `main()` logs `true`/`false` for five test inputs

## Non-functional requirements

- [ ] Use `===` for null/undefined checks
- [ ] No coercion with `==`

## Constraints

- One file

## Acceptance criteria

- [ ] All five tests behave as specified
- [ ] Explain why `if ("   ")` is true but your validator returns false

## Example data

| input | valid |
|-------|-------|
| "ada" | true |
| "" | false |
| "   " | false |
| null | false |

## Suggested plan

1. Handle null/undefined.
2. trim + length check.
3. Log matrix of cases.

## Deliverables

- [ ] `starter/index.js`

## Extensions

- [ ] Reject names shorter than 2 chars after trim
