# Price Split Formatter

## Problem context
A bill-splitting tool reads a total charge and party size from `stdin`, then shows each person's share formatted as currency.

## Goal
Parse two numeric lines and print `Share: $<amount>` with exactly two decimal places.

## Functional requirements
- [ ] Line 1: `total` (finite number, `> 0`).
- [ ] Line 2: `people` (positive integer).
- [ ] Invalid or non-finite numbers → `ERROR: invalid number`.
- [ ] `people` must be integer `>= 1`.
- [ ] Compute `share = total / people` and print `Share: $` + `share.toFixed(2)`.

## Non-functional requirements
- [ ] Validate with `Number.isFinite` before dividing
- [ ] Use `toFixed(2)` for display only

## Constraints
- [ ] Node.js only
- [ ] Trim whitespace on each line before parsing

## Acceptance criteria
- [ ] `100` and `4` → `Share: $25.00`
- [ ] `10` and `3` → `Share: $3.33`
- [ ] `abc` and `4` → error
- [ ] `100` and `0` → error

## Example data

Input:
- `100`
- `4`

Output:
- `Share: $25.00`

## Suggested plan (no solution)
1. Read two lines; trim and parse with `Number()`.
2. Reject non-finite values and invalid `people`.
3. Divide and format with `toFixed(2)`.
4. Print the labeled share string.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print remainder cents when split is not exact.
