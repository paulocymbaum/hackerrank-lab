<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/01-truthy-falsy.md -->

# Truthy vs Falsy

## Context
In `if (...)`, JavaScript converts the value to boolean using the internal *ToBoolean* rules.

## The falsy list (only these)
- `false`
- `0`, `-0`, `0n`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

Everything else is **truthy**.

## Code

```js
const values = [false, 0, "", null, undefined, NaN, "0", [], {}, "false", -1];

for (const v of values) {
  console.log(String(v).padEnd(10), "->", Boolean(v));
}
```

## What to notice
- `"0"` is **truthy** (non-empty string).
- `[]` and `{}` are **truthy** (objects are always truthy).
- Falsy does **not** mean “invalid” (e.g. `0` can be a valid input).

## Mini-exercise
Predict the output:

```js
console.log(Boolean([]));
console.log(Boolean({}));
console.log(Boolean(" ")); // space string
console.log(Boolean(""));
```
