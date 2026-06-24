# Shallow vs Deep Copy

> Graph index: `02.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:02-objects-references-and-copying/02.2-shallow-vs-deep-copy:README.md -->

## Context

Shallow copy creates a new **top-level container**, but nested objects are still shared. This is the main reason "I copied it but the original changed" bugs happen.

## Predict first

What is `user.address.city` after this runs?

```js
const user = {
  name: "Ana",
  address: { city: "SP" },
};
const copy = { ...user };
copy.address.city = "RJ";
console.log(user.address.city);
```

## Explanation

Object spread is shallow:

```js
const copy = { ...user };
copy.address.city = "RJ"; // mutates shared nested object
```

Array spread is shallow too:

```js
const a = [{ x: 1 }];
const b = [...a];
b[0].x = 99; // mutates shared inner object
```

## What to observe

- `copy` is a new top-level object; `copy.address` still references `user.address`.
- To update nested data safely, copy every level you touch (copy-on-write).

## Safer update pattern

```js
const next = {
  ...user,
  address: { ...user.address, city: "RJ" },
};
```

## Quick challenge

Update `user.address.city` to `"RJ"` without mutating `user.address`.
