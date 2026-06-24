# Microtask Before Timer

## Problem context
Mixing Promises and timers causes ordering bugs when developers assume `setTimeout(0)` runs immediately.

## Goal
For the lesson's canonical snippet, print the full output order and a one-line rule explaining why the Promise callback runs before the timer.

## Lesson concepts practiced
- [ ] Promise reactions are microtasks
- [ ] Microtasks drain before the next task
- [ ] `setTimeout(0)` schedules a task, not immediate execution

## Functional requirements
- [ ] Hardcode snippet `lesson` matching the lesson Predict first example
- [ ] Print three lines:
  - [ ] `order: start end micro timer`
  - [ ] `rule: microtasks drain before the next task`
  - [ ] `micro_before_timer: true`
- [ ] Read optional stdin line (ignored); always print the analysis for `lesson`

## Non-functional requirements
- [ ] Do not use `eval`
- [ ] Output is deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] Running `node starter/index.js` prints order `start end micro timer`
- [ ] Rule line mentions microtasks before tasks
- [ ] `micro_before_timer: true` is printed

## Example data

Output:

```
order: start end micro timer
rule: microtasks drain before the next task
micro_before_timer: true
```

## Suggested plan (no solution)
1. Hardcode correct order from lesson example.
2. Print order, rule, and confirmation flag in `main`.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add chained microtask snippet `m1 m2` before `t1`.
