<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:02-objects-references-and-copying:examples/03-deep-copy-and-structuredclone.md -->

# Example 03 — Deep Copy: `structuredClone` vs JSON

## Context
Sometimes you need a full snapshot (deep copy). But not all deep-copy techniques are correct for all data.

## Example A — JSON cloning is lossy
Predict what prints:

```js
const x = {
  when: new Date("2020-01-01T00:00:00Z"),
  n: 1,
};

const y = JSON.parse(JSON.stringify(x));
console.log(typeof y.when, y.when);
```

### What to observe
- JSON turns `Date` into a **string**.
- JSON drops `undefined` and cannot represent functions.
- JSON throws on `BigInt`.
- JSON fails on cycles.

## Example B — `structuredClone` preserves more types
If your runtime supports it, try:

```js
const x = {
  when: new Date("2020-01-01T00:00:00Z"),
  set: new Set([1, 2]),
};

const y = structuredClone(x);
console.log(y.when instanceof Date);
console.log(y.set instanceof Set);
```

## Trade-off
Deep copying everything can be expensive. Prefer:
- shallow copies + copy-on-write for most updates
- deep copy only when you truly need an immutable snapshot boundary

## Mini-exercise
Create a function `cloneForSafety(value)` with this behavior:
- If `structuredClone` exists, use it.
- Otherwise, allow only JSON-safe data and clone with JSON.
- If cloning fails, throw a helpful error.
