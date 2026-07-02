# Sentinel Sum

## Problem context
A telemetry collector reads numeric samples until it receives a sentinel value `0`. The running total must use a `while` loop because the count is not known upfront.

## Goal
## Lesson concepts practiced
- [ ] If the condition starts false, the body never runs (
- [ ] Apply concepts from while Loop
- [ ] Match acceptance criteria to lesson examples

Read integers one per line until `0`, sum all prior values, and print the total.

## Functional requirements
- [ ] Read lines until a line parses to integer `0`.
- [ ] Non-integer line before sentinel → `ERROR: invalid number`.
- [ ] Do **not** include the `0` in the sum.
- [ ] If first line is `0`, sum is `0`.
- [ ] Print `Sum: <total>` after sentinel.

## Non-functional requirements
- [ ] Use `while` — not `for`
- [ ] Update loop variables inside the body to avoid infinite loops

## Constraints
- [ ] Node.js only
- [ ] Integers only (`Number.isInteger`)

## Acceptance criteria
- [ ] `10`, `20`, `0` → `Sum: 30`
- [ ] `0` → `Sum: 0`
- [ ] `5`, `abc` → error
- [ ] `-3`, `7`, `0` → `Sum: 4`
- [ ] Reads values in a `while` loop until sentinel `0`; updates loop variables each iteration

## Example data

Input:
- `10`
- `20`
- `0`

Output:
- `Sum: 30`

## Suggested plan (no solution)
1. Read first line; if not `0`, validate and add to sum.
2. `while` last value is not `0`, read next line and accumulate.
3. Stop when `0` is read; print labeled sum.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print how many values were summed.
