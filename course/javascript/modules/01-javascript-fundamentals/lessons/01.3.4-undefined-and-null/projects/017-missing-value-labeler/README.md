# Missing Value Labeler

## Problem context
Optional profile fields arrive as real values, the literal token `null`, or the literal token `undefined`. Downstream code must label each case consistently.

## Goal
Read one token from `stdin` and print a single status label.

## Functional requirements
- [ ] Read one trimmed line `token`.
- [ ] Labels:
  - [ ] `undefined` → `missing`
  - [ ] `null` → `empty`
  - [ ] any other value (including empty string `""`) → `has-value`
- [ ] Matching is **exact string** on the trimmed line (case-sensitive).

## Non-functional requirements
- [ ] Use strict equality (`===`) when comparing to `"undefined"` and `"null"`
- [ ] Do not use `typeof` for null checks

## Constraints
- [ ] Node.js only
- [ ] Input is always one line

## Acceptance criteria
- [ ] `undefined` → `missing`
- [ ] `null` → `empty`
- [ ] `Ana` → `has-value`
- [ ] `` (empty line after trim) → `has-value`
- [ ] `0` → `has-value`

## Example data

Input:
- `null`

Output:
- `empty`

## Suggested plan (no solution)
1. Trim the line.
2. Branch with `===` for `"undefined"` and `"null"`.
3. Default to `has-value` for everything else.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept JSON `null` from parsed input and treat as `empty`.
