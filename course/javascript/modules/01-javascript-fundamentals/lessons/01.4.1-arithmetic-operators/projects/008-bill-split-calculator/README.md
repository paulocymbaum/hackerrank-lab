# Expression Evaluator

## Problem context
Arithmetic bugs often come from `+` concatenating strings or wrong precedence — not from division alone.

## Goal
Read `a`, operator, and `b` from stdin and evaluate the expression, demonstrating string concatenation vs numeric addition.

## Lesson concepts practiced
- [ ] `+` concatenates strings (`"10" + 5` → `"105"`)
- [ ] `%` remainder and `**` exponentiation
- [ ] Operator precedence (`2 + 3 * 4` → `14`, not `20`)

## Functional requirements
- [ ] Read 3 lines: `a`, `op`, `b` where `op` is one of `+ - * / % **`.
- [ ] Parse `a` and `b` as strings (do not coerce before `+` — use raw trimmed lines).
- [ ] For `+`: if both operands are finite numbers when parsed with `Number()`, add numerically; else concatenate as strings.
- [ ] For `- * / % **`: convert both with `Number()`; if not finite → `ERROR: invalid number`.
- [ ] For `/`: division by zero → `ERROR: division by zero`.
- [ ] Print `Result: <value>`.
- [ ] Support one-line mode: `2 + 3 * 4` (split on spaces) uses precedence: `*` before `+`.

## Non-functional requirements
- [ ] Precedence expression evaluated correctly without `eval`
- [ ] Clear errors

## Constraints
- [ ] Node.js only
- [ ] No `eval`

## Acceptance criteria
- [ ] `10`, `+`, `5` with numeric parsing path → `Result: 15`
- [ ] `"10"`, `+`, `5` → `Result: 105` (string concat)
- [ ] `10`, `%`, `3` → `Result: 1`
- [ ] `2`, `**`, `3` → `Result: 8`
- [ ] Expression line `2 + 3 * 4` → `Result: 14`

## Example data

Input:
- `10`
- `+`
- `5`

Output:
- `Result: 15`

## Suggested plan (no solution)
1. Detect 1-line vs 3-line input mode.
2. For `+`, branch on numeric vs string concat per rules.
3. Implement simple two-op precedence for the challenge expression.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Parentheses support for precedence.
