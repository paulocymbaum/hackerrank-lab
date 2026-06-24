# structuredClone

> Graph index: `02.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:02-objects-references-and-copying/02.3-structuredclone:README.md -->

## Context

Sometimes you need a full snapshot (deep copy). JSON cloning is simple but lossy; `structuredClone` preserves more types when available.

## Predict first

What is `typeof y.when` after JSON clone?

```js
const x = {
  when: new Date("2020-01-01T00:00:00Z"),
  n: 1,
};
const y = JSON.parse(JSON.stringify(x));
console.log(typeof y.when, y.when);
```

## Explanation

JSON clone limitations:

- `Date` becomes a string
- Drops `undefined`, functions, `Symbol`
- Throws on `BigInt` and cycles

`structuredClone` preserves more:

```js
const y = structuredClone(x);
console.log(y.when instanceof Date); // true
```

## What to observe

- Prefer shallow copy + copy-on-write for most updates.
- Deep copy when you need an immutable snapshot boundary.
- `structuredClone` is the modern default when supported.

## Quick challenge

Implement `cloneForSafety(value)`: use `structuredClone` when available, else JSON for JSON-safe data only.
