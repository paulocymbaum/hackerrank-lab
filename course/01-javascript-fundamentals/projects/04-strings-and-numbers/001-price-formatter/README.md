# Price Formatter

## Problem context

E-commerce displays must show consistent price strings. Raw numbers confuse users; bad conversion yields `NaN`.

## Goal

Format a numeric price with a template literal and guard invalid input.

## Functional requirements

- [ ] `formatPrice(amount)` returns `` `R$ ${amount.toFixed(2)}` `` for valid numbers
- [ ] If `Number(amount)` is `NaN`, return `"invalid"`
- [ ] `main()` logs formatted price for `19.9` and logs `"invalid"` for `"abc"`

## Non-functional requirements

- [ ] Explicit conversion before formatting
- [ ] No thrown errors for bad input

## Constraints

- Single file; Node only

## Acceptance criteria

- [ ] Valid: `R$ 19.90`
- [ ] Invalid: `invalid`
- [ ] Stack trace for `formatPrice` shows when `toFixed` runs

## Example data

| Input | Output |
|-------|--------|
| 19.9 | R$ 19.90 |
| "abc" | invalid |

## Suggested plan

1. `Number()` + `NaN` check.
2. Template for success path.
3. Test both paths in `main`.

## Deliverables

- [ ] `starter/index.js`

## Extensions

- [ ] Support discount percent parameter
