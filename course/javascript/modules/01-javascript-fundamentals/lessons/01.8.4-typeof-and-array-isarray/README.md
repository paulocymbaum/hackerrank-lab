<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.8.4-typeof-and-array-isarray:README.md -->

# typeof and Array.isArray

## Context
JavaScript's `typeof` operator is useful but has well-known quirks. Arrays are objects, so `typeof []` is `"object"`. Use `Array.isArray` when you need to distinguish arrays from plain objects.

## Predict first

What prints?

```js
console.log(typeof null);
console.log(typeof []);
console.log(typeof {});
console.log(Array.isArray([]));
console.log(Array.isArray(null));
```

### What to observe
- `typeof null` is `"object"` (historical bug, kept for compatibility).
- `typeof []` is `"object"`, not `"array"`.
- `Array.isArray([])` is `true`; `Array.isArray(null)` is `false`.

## Explanation

| Value | `typeof` | `Array.isArray` |
|-------|----------|-----------------|
| `null` | `"object"` | `false` |
| `[]` | `"object"` | `true` |
| `{}` | `"object"` | `false` |
| `"hi"` | `"string"` | `false` |
| `42` | `"number"` | `false` |
| `true` | `"boolean"` | `false` |
| `undefined` | `"undefined"` | `false` |
| `() => {}` | `"function"` | `false` |

Rule of thumb:
- Use `typeof x === "string"` / `"number"` / `"boolean"` / `"undefined"` for primitives.
- Use `x === null` to test null (not `typeof`).
- Use `Array.isArray(x)` to test arrays (not `typeof x === "object"` alone).

## What to observe

```js
function classify(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

console.log(classify(null));    // "null"
console.log(classify([]));      // "array"
console.log(classify({}));      // "object"
```

## Quick challenge
Without running, classify each value: `0`, `""`, `[]`, `{}`, `null`, `undefined`, `"0"`.

Which checks would you use in validation code for each?
