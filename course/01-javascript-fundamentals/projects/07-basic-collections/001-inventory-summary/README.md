# Inventory Summary

## Problem context

A warehouse API returns item records. You must summarize stock using arrays and objects.

## Goal

Given a hard-coded `inventory` array, print total items and names of low-stock products using `map`/`filter`.

## Functional requirements

- [ ] `inventory` is array of `{ name, qty }` with at least 4 items
- [ ] `totalUnits(items)` sums `qty` with a loop or `reduce` (loop OK)
- [ ] `lowStockNames(items)` returns names where `qty < 5` using `filter` + `map`
- [ ] `main()` logs total and low-stock list

## Non-functional requirements

- [ ] Callbacks in `map`/`filter` are small named functions (not only inline) for stack practice

## Constraints

- No npm; one file

## Acceptance criteria

- [ ] Correct total units
- [ ] Low-stock names array printed
- [ ] Explain one `map` callback stack frame in writing

## Example data

```js
[{ name: "pen", qty: 10 }, { name: "ink", qty: 2 }]
// total 12; low: ["ink"]
```

## Suggested plan

1. Seed data; implement `totalUnits`.
2. `lowStockNames` with filter+map.
3. Trace one `map` call.

## Deliverables

- [ ] `starter/index.js`

## Extensions

- [ ] Sort low-stock names alphabetically
