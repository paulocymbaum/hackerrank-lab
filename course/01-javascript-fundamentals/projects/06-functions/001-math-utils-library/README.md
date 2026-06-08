# Math Utils Library

## Problem context

Game logic shares small math helpers. Each helper is a pure function with clear stack behavior.

## Goal

Create `add`, `subtract`, and `average` (declaration, expression, arrow) and use them from `main()`.

## Functional requirements

- [ ] `function add(a, b)` declaration
- [ ] `const subtract = function (a, b) { ... }` expression
- [ ] `const average = (a, b) => (a + b) / 2` arrow
- [ ] `main()` logs results for `(10, 4)` for each

## Non-functional requirements

- [ ] Pure functions (no globals mutated)
- [ ] Names describe behavior

## Constraints

- One file; Node

## Acceptance criteria

- [ ] add 14; subtract 6; average 7
- [ ] Stack diagram for `main` → `add` → return

## Example data

```text
add(10,4) → 14
subtract(10,4) → 6
average(10,4) → 7
```

## Suggested plan

1. Implement three functions.
2. Call from `main` in sequence; trace frames.
3. Verify return values.

## Deliverables

- [ ] `starter/index.js`

## Extensions

- [ ] `clamp(n, min, max)` using the helpers
