# Receipt Printer

## Problem context
Your team logs order summaries to the terminal during development. Stakeholders want readable, labeled output — not raw values dumped without context.

## Goal
## Lesson concepts practiced
- [ ] `console.log(x)` is like `process.stdout.write(String(x) + "\n")`.
- [ ] Mixing raw writes and `console.log` can produce surprising line breaks.
- [ ] Label every value in exercise output (`Item:`, `Qty:`, `ERROR:`) so reviewers can scan results quickly.

Read three lines from `stdin` (item name, quantity, unit price) and print a formatted receipt to `stdout` using clear labels and fixed decimal formatting.

## Functional requirements
- [ ] Read 3 lines from `stdin`:
  - [ ] `item` (string, required after trim)
  - [ ] `quantity` (positive integer as string, required)
  - [ ] `unitPrice` (number as string, may have decimals, required)
- [ ] Validate each field explicitly; on failure print `ERROR: <message>` (single line).
- [ ] On success print exactly 4 lines:
  - [ ] `Item: <item>`
  - [ ] `Qty: <quantity>`
  - [ ] `Unit: $<price with 2 decimals>`
  - [ ] `Total: $<qty * unitPrice with 2 decimals>`

## Non-functional requirements
- [ ] Readable labels on every output line
- [ ] Consistent money formatting (always 2 decimal places)
- [ ] Clear validation errors (which field failed)

## Constraints
- [ ] Node.js only (no external libraries)
- [ ] Use `Number()` for numeric conversion
- [ ] Reject non-finite numbers and non-positive quantity

## Acceptance criteria
- [ ] `Coffee`, `2`, `3.5` → four labeled lines; total is `$7.00`
- [ ] Empty item name → `ERROR: item is required`
- [ ] `quantity` of `0` or `-1` → `ERROR: quantity must be positive`
- [ ] `unitPrice` of `abc` → `ERROR: unitPrice must be a number`

## Example data

### Valid input
Input:
- `Notebook`
- `3`
- `4.25`

Output:
- `Item: Notebook`
- `Qty: 3`
- `Unit: $4.25`
- `Total: $12.75`

### Invalid input
Input:
- `Pen`
- `abc`
- `1.00`

Output:
- `ERROR: quantity must be a positive integer`

## Suggested plan (no solution)
1. Collect three lines (buffer or readline `line` events).
2. Trim strings; check emptiness before converting numbers.
3. Parse `quantity` as integer (`Number` + `Number.isInteger` + `> 0`).
4. Parse `unitPrice` with `Number()` + `Number.isFinite`.
5. Format money with `toFixed(2)` and print labeled lines.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `Discount: $<amount>` line when quantity is 5 or more (10% off total).
- [ ] Right-align dollar amounts for a column-style receipt.
