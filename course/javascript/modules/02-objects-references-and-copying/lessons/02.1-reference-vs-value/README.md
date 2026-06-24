<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:02-objects-references-and-copying:examples/01-reference-vs-value.md -->

# Example 01 — Reference vs Value (Predict-first)

## Context
In JavaScript, most “weird bugs” around objects come from one fact: **variables can share the same object**. This example trains you to predict when a change affects only one variable vs both.

## Example A — primitives behave like values
Predict the output first:

```js
let a = 1;
let b = a;

b = 2;
console.log(a, b);
```

### What to observe
- `b = a` copies the **value** `1`.
- Reassigning `b` does not change `a`.

## Example B — objects behave like references
Predict the output first:

```js
const a = { n: 1 };
const b = a;

b.n = 2;
console.log(a.n, b.n);
```

### What to observe
- `b = a` creates an **alias**.
- Mutating through `b` mutates the same object that `a` references.

## Pitfall
Don’t confuse **reassignment** with **mutation**:

```js
const a = { n: 1 };
let b = a;

b = { n: 999 };     // reassignment (b points elsewhere)
a.n = 2;            // mutation (changes the original object)

console.log(a.n, b.n);
```

## Mini-exercise
Without running the code, answer:
1) Which lines create a new object?
2) Which lines mutate an existing object?

Then run and confirm your predictions.
