# typeof and Array.isArray

> Graph index: `01.8.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.8.4-typeof-and-array-isarray:README.md -->

## Context

Runtime type checks help you validate messy input. `typeof` is useful but has gaps — especially for `null` and arrays.

## typeof basics

```js
console.log(typeof "hi");      // "string"
console.log(typeof 42);        // "number"
console.log(typeof true);      // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof {});        // "object"
```

## The typeof null quirk

```js
console.log(typeof null); // "object" (legacy bug)
```

Never check `typeof x === "null"`. Use `x === null` instead.

## Arrays are objects

```js
console.log(typeof []);        // "object"
console.log(Array.isArray([])); // true
```

Always use `Array.isArray(value)` to detect arrays.

## Predict first

What is printed?

```js
const values = [null, [], 0, NaN, ""];

for (const v of values) {
  const label = Array.isArray(v) ? "array" : typeof v;
  console.log(v, "->", label);
}
```

## What to observe

- Order matters: check `value === null` **before** `typeof`.
- Check `Array.isArray` **before** treating something as a plain object.
- `typeof NaN` is `"number"` — use `Number.isNaN(x)` for NaN specifically.
- `Number.isFinite(x)` distinguishes real numbers from `NaN` / `Infinity`.

## Mini-exercise

Implement mental rules for:

```js
describe(null);    // "null" (not "object")
describe([]);      // "array"
describe(NaN);     // "NaN" or not finite
describe(0);       // "number"
```
