# Bill Split Calculator

## Problem context
After dinner, your app splits the bill evenly. Totals must be exact to the cent — floating-point surprises are not acceptable in the output.

## Goal
Read `total` and `people` from `stdin` and print each person's share formatted to two decimals.

## Functional requirements
- [ ] Read 2 lines: `total` (number), `people` (positive integer).
- [ ] Validate both fields; on error print `ERROR: <message>` (one line).
- [ ] Compute `share = total / people`.
- [ ] Print `Share: $<amount>` with exactly 2 decimal places.

## Non-functional requirements
- [ ] Clear validation messages
- [ ] Readable output label

## Constraints
- [ ] Node.js only
- [ ] Use `Number()` for parsing
- [ ] Reject non-finite `total` and non-positive `people`

## Acceptance criteria
- [ ] `100` and `4` → `Share: $25.00`
- [ ] `10` and `3` → `Share: $3.33` (rounded display via `toFixed(2)`)
- [ ] `people` of `0` → error
- [ ] `total` of `abc` → error

## Example data

Input:
- `50`
- `2`

Output:
- `Share: $25.00`

## Suggested plan (no solution)
1. Read and trim two lines.
2. Parse with `Number()`; validate with `Number.isFinite` / `Number.isInteger`.
3. Divide and format with `toFixed(2)`.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print remainder cents separately when split is not exact.
