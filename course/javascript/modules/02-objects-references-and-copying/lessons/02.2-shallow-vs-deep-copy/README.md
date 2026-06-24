<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:02-objects-references-and-copying:examples/02-shallow-copy-pitfalls.md -->

# Example 02 — Shallow Copy Pitfalls (Nested trap)

## Context
Shallow copy creates a new **top-level container**, but it does **not** duplicate nested objects. This is the #1 reason someone says “I copied it but the original changed”.

## Example A — object spread is shallow
Predict the output first:

```js
const user = {
  name: "Ana",
  address: { city: "SP" },
};

const copy = { ...user };
copy.address.city = "RJ";

console.log(user.address.city);
```

### What to observe
- `copy` is a new object.
- `copy.address` and `user.address` point to the **same nested object**.

## Example B — array spread is shallow
Predict the output first:

```js
const a = [{ x: 1 }];
const b = [...a];

b[0].x = 99;
console.log(a[0].x);
```

## Safer update pattern (copy-on-write)
If you change nested data, copy every level you touch:

```js
const next = {
  ...user,
  address: {
    ...user.address,
    city: "RJ",
  },
};
```

## Mini-exercise
Given:

```js
const state = { items: [{ id: 1, qty: 1 }] };
```

Write a `nextState` that increments `qty` for `id: 1` without mutating `state`.
