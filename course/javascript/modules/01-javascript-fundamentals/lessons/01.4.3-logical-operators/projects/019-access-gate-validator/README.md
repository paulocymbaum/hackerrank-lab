# Access Gate Validator

## Problem context
A venue scanner grants entry only when a visitor is an adult **and** presents ID. Both conditions must pass — a classic `&&` validation.

## Goal
## Lesson concepts practiced
- [ ] `&&` needs every condition true; `||` needs at least one true.
- [ ] Use `!` sparingly — prefer positive names like `isValid` over `!isInvalid`.
- [ ] Short-circuit avoids errors (e.g. check length before accessing characters).

Read `age` and `hasId`, then print `ALLOWED` or `DENIED`.

## Functional requirements
- [ ] Line 1: `age` (non-negative integer).
- [ ] Line 2: `hasId` — exactly `true` or `false` (lowercase).
- [ ] Invalid age or hasId → `ERROR: invalid input`.
- [ ] `ALLOWED` when `age >= 18 && hasId === true`.
- [ ] Otherwise `DENIED`.

## Non-functional requirements
- [ ] Combine conditions with `&&` in one expression or named variable
- [ ] Parse `hasId` as boolean, not truthy string `"false"`

## Constraints
- [ ] Node.js only
- [ ] `hasId` must be literal `true` or `false` text

## Acceptance criteria
- [ ] `20` and `true` → `ALLOWED`
- [ ] `20` and `false` → `DENIED`
- [ ] `17` and `true` → `DENIED`
- [ ] `25` and `yes` → error

## Example data

Input:
- `20`
- `true`

Output:
- `ALLOWED`

## Suggested plan (no solution)
1. Parse age; validate integer `>= 0`.
2. Map `hasId` line to boolean only for `true`/`false`.
3. Evaluate `canEnter = age >= 18 && hasId`.
4. Print access label.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `SENIOR` discount flag when `age >= 65 && hasId`.
