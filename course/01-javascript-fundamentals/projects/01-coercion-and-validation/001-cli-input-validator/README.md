# CLI Input Validator

## Problem context
You’re building a tiny CLI tool that receives user input as **strings** (like in HackerRank). Your team keeps shipping bugs because checks rely on truthiness/coercion instead of explicit validation.

## Goal
Build a CLI program that reads 3 values and prints either a normalized result or an error message. The exercise is about **explicit conversion** and **defensive checks**.

## Functional requirements
- [ ] Read input from `stdin` (3 lines):
  - [ ] `age` (expected integer, may be `0`)
  - [ ] `score` (expected number, may be `0` or decimals)
  - [ ] `isActive` (expected string: `true` or `false`, case-insensitive)
- [ ] Convert values explicitly:
  - [ ] Use `Number()` for numeric parsing (no implicit coercion).
  - [ ] Reject non-finite numbers with `Number.isFinite(...)`.
- [ ] Output:
  - [ ] If valid, print a single JSON line with `{ age, score, isActive }` using correct types.
  - [ ] If invalid, print `ERROR: <message>` (single line).

## Non-functional requirements
- [ ] Readability and maintainability
- [ ] Clear error messages (tell which field is invalid and why)
- [ ] No unexpected truthiness checks for numeric fields (don’t treat `0` as missing)

## Constraints
- [ ] Node.js only (no external dependencies)
- [ ] Do not use `parseInt` / `parseFloat` for the numeric fields (use `Number()`)

## Acceptance criteria
- [ ] `age = 0` is accepted as valid input.
- [ ] Empty strings are rejected for all fields.
- [ ] `score` rejects `NaN`, `Infinity`, `-Infinity`.
- [ ] `isActive` accepts `true/false` in any casing (e.g. `TRUE`, `False`).

## Example data

### Valid input
Input:
- `0`
- `10.5`
- `TRUE`

Output:
- `{"age":0,"score":10.5,"isActive":true}`

### Invalid input
Input:
- ``
- `10`
- `true`

Output:
- `ERROR: age is required`

## Suggested plan (no solution)
1. Read `stdin` lines and trim safely.
2. Validate emptiness explicitly (check `line.length === 0`).
3. Convert using `Number(...)`, validate with `Number.isFinite`.
4. Normalize `isActive` with `toLowerCase()` and compare to `"true"` / `"false"`.
5. Print output in the required format.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept `isActive` values like `1/0` and `yes/no` (explicit mapping only).
- [ ] Support optional whitespace lines in the input.
