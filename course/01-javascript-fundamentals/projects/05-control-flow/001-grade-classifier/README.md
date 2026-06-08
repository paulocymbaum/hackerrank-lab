# Grade Classifier

## Problem context

A school portal maps numeric scores to letter grades. Rules must be explicit and testable.

## Goal

Implement `letterGrade(score)` using `if/else` or `switch` and print results from `main()`.

## Functional requirements

- [ ] 90–100 → `A`; 80–89 → `B`; 70–79 → `C`; 60–69 → `D`; below 60 → `F`
- [ ] Scores outside 0–100 return `"invalid"`
- [ ] `main()` tests at least three scores including one invalid

## Non-functional requirements

- [ ] Single return path per branch clarity
- [ ] No magic numbers without comment

## Constraints

- Node; one file

## Acceptance criteria

- [ ] 95 → A; 55 → F; 150 → invalid
- [ ] Paper trace: `return` inside `letterGrade` pops only that frame

## Example data

| score | out |
|-------|-----|
| 95 | A |
| 55 | F |
| 150 | invalid |

## Suggested plan

1. Bounds check first.
2. Ladder if/else or switch.
3. Log from `main`.

## Deliverables

- [ ] `starter/index.js`

## Extensions

- [ ] `switch` with fall-through avoided
