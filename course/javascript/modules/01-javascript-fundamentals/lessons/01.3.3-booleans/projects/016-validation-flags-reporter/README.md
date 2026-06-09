# Validation Flags Reporter

## Problem context
A grading service stores boolean flags for each submission before running heavier checks. You need a CLI that computes and reports those flags from a single score.

## Goal
Read one score and print three boolean flags on separate lines.

## Functional requirements
- [ ] Read one line `score` (0–100 integer).
- [ ] Invalid input → `ERROR: invalid score`.
- [ ] Compute and print:
  - [ ] `passed: <true|false>` — `score >= 60`
  - [ ] `perfect: <true|false>` — `score === 100`
  - [ ] `invalid: <true|false>` — `score < 0 || score > 100`
- [ ] Print lowercase `true` / `false` as shown.

## Non-functional requirements
- [ ] Store each flag in a named boolean variable before printing
- [ ] Use comparisons that return booleans directly

## Constraints
- [ ] Node.js only
- [ ] Score must be integer in range for `passed`/`perfect`; out-of-range still sets `invalid: true`

## Acceptance criteria
- [ ] `90` → `passed: true`, `perfect: false`, `invalid: false`
- [ ] `100` → `passed: true`, `perfect: true`, `invalid: false`
- [ ] `105` → `passed: true`, `perfect: false`, `invalid: true`
- [ ] `abc` → error

## Example data

Input:
- `90`

Output:
```
passed: true
perfect: false
invalid: false
```

## Suggested plan (no solution)
1. Parse score; validate integer (allow out-of-range for flag demo, or validate first — document: accept any integer).
2. Assign `passed`, `perfect`, `invalid` with comparison expressions.
3. Print three labeled lines.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `needsReview: true` when `invalid` is true.
