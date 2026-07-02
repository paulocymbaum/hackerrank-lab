# Clamp Utility

## Problem context
API rate limiters and UI sliders need a `clamp` helper that forces a value into `[min, max]` without printing inside the function.

## Goal
## Lesson concepts practiced
- [ ] Parameter count and order matter — document what each parameter means.
- [ ] Use early `return` for invalid input instead of deep nesting.
- [ ] Prefer returning values over printing inside helpers.

Implement `clamp(value, min, max)` with early returns, read three numbers from `stdin`, and print the clamped result.

## Functional requirements
- [ ] Implement `function clamp(value, min, max)` that **returns** a number (no `console.log` inside).
- [ ] If `value < min` → return `min`.
- [ ] If `value > max` → return `max`.
- [ ] Otherwise return `value`.
- [ ] Read `value`, `min`, `max` from `stdin` (one per line).
- [ ] Invalid number → `ERROR: invalid number`.
- [ ] If `min > max` → `ERROR: invalid range`.
- [ ] Print `Result: <clamped>`.

## Non-functional requirements
- [ ] Separate computation (`return`) from I/O (`console.log` / `process.stdout.write`)
- [ ] Use early `return` branches

## Constraints
- [ ] Node.js only
- [ ] `clamp` must be reusable — caller prints the result

## Acceptance criteria
- [ ] `5`, `0`, `10` → `Result: 5`
- [ ] `-3`, `0`, `10` → `Result: 0`
- [ ] `99`, `0`, `10` → `Result: 10`
- [ ] `5`, `10`, `0` → `ERROR: invalid range`

## Example data

Input:
- `-3`
- `0`
- `10`

Output:
- `Result: 0`

## Suggested plan (no solution)
1. Write `clamp` with three early-return paths.
2. Parse stdin numbers in `main`.
3. Call `clamp` and print the labeled result.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `clampMany(values, min, max)` returning an array.
