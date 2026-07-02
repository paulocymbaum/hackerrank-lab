# Alias Tracker

## Problem context
Object bugs come from confusing **mutation through an alias** with **reassignment** to a new object.

## Goal
Simulate a fixed sequence of steps on `const original = { n: 1 }` and after each step print whether `original.n` changed and label the step as **mutation** or **reassignment**.

## Lesson concepts practiced
- [ ] Primitives copy by value; objects alias by reference
- [ ] Mutating through alias changes the shared object
- [ ] Reassignment points a variable elsewhere without copying

## Functional requirements
- [ ] Hardcode steps (do not read from stdin):
  1. `let b = original` — print `step 1: original.n=1 unchanged (binding)`
  2. `b.n = 2` — print `step 2: original.n=2 changed (mutation)`
  3. `b = { n: 99 }` — print `step 3: original.n=2 unchanged (reassignment)`
  4. `original.n = 5` — print `step 4: original.n=5 changed (mutation)`
- [ ] Final line: `final: original.n=5 b.n=99`
- [ ] Each step line must include `mutation`, `reassignment`, or `binding` label

## Non-functional requirements
- [ ] Use `const original`; use `let b` for rebinding
- [ ] Do not mutate via spread copies — exercise raw references

## Constraints
- [ ] Node.js only
- [ ] Deterministic output (no stdin)

## Acceptance criteria
- [ ] Step 2 reports `original.n=2` and `mutation`
- [ ] Step 3 reports `original.n=2` unchanged and `reassignment`
- [ ] Final line shows `original.n=5` and `b.n=99`
- [ ] All four steps printed in order

## Example data

Output:

```
step 1: original.n=1 unchanged (binding)
step 2: original.n=2 changed (mutation)
step 3: original.n=2 unchanged (reassignment)
step 4: original.n=5 changed (mutation)
final: original.n=5 b.n=99
```

## Suggested plan (no solution)
1. Create `original` and `b`; run each step in order.
2. After each step, log `original.n` and the label.
3. Print final values.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a primitive `let x = 1; let y = x; y = 2` step showing value copy.
