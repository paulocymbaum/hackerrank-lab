# Output Order Predictor

## Problem context
Your team keeps getting “mystery” output orders when mixing synchronous code, timers, and promises. You want a repeatable way to practice reasoning about the event loop.

## Goal
Build a small program that reads code snippets (predefined) and prints the expected output order, along with a short explanation referencing **call stack**, **microtasks**, and **tasks**.

## Functional requirements
- [ ] Provide at least 6 predefined snippets (as strings) that include:
  - [ ] sync logs
  - [ ] `setTimeout(..., 0)`
  - [ ] `Promise.resolve().then(...)`
  - [ ] `async/await` (at least one)
- [ ] For each snippet, print:
  - [ ] the snippet name
  - [ ] the expected output order (one line)
  - [ ] a 3–6 line explanation of *why* (microtasks vs tasks)
- [ ] Include one “trick” snippet that demonstrates microtasks running before timers.

## Non-functional requirements
- [ ] Readable structure (helpers like `explain(snippet)` are encouraged)
- [ ] Explanations must use consistent vocabulary: call stack, microtask queue, task queue

## Constraints
- [ ] No external libraries
- [ ] Do not execute the snippets with `eval` (this is reasoning practice)

## Acceptance criteria
- [ ] At least one snippet includes both microtasks and timers and is explained correctly.
- [ ] The output order is deterministic and matches the event loop model taught in the module.

## Example data
Snippet:

```js
console.log("A");
Promise.resolve().then(() => console.log("micro"));
setTimeout(() => console.log("timer"), 0);
console.log("B");
```

Expected order:
- `A B micro timer`

## Suggested plan (no solution)
1. Write down the rule: run sync → drain microtasks → run one task.
2. For each snippet, mark each log as sync/microtask/task.
3. Assemble the final order and explanation.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a “quiz mode” that hides the answer until the user presses Enter.
