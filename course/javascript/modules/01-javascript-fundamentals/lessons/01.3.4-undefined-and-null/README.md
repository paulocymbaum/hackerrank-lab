# undefined and null

> Graph index: `01.3.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.3.4-undefined-and-null:README.md -->

## Context

Sometimes a value is **missing**. JavaScript uses `undefined` (nothing assigned yet) and `null` (intentionally empty). Input parsers and optional fields in CLI tools must distinguish "not provided" from real values.

## undefined — not assigned

```js
let nickname;
console.log(nickname);        // undefined
console.log(typeof nickname); // "undefined"
```

A declared variable with no assignment is `undefined`.

## null — intentionally empty

```js
let middleName = null; // explicitly "no middle name"
console.log(middleName);        // null
console.log(typeof middleName); // "object" (legacy quirk)
```

Use `null` when your code means "known to be absent."

## Checking for missing values

```js
function describe(value) {
  if (value === undefined) {
    return "not provided";
  }
  if (value === null) {
    return "explicitly empty";
  }
  return String(value);
}

console.log(describe(undefined));
console.log(describe(null));
console.log(describe("Ana"));
```

Prefer `=== null` or `=== undefined` — never `typeof x === "null"`.

## Default with undefined

```js
let retries;
if (retries === undefined) {
  retries = 3;
}
console.log(retries); // 3
```

## Predict first

What is printed?

```js
let a;
const b = null;

console.log(a);
console.log(b);
console.log(a === undefined);
console.log(b === undefined);
console.log(b === null);
```

## What to observe

- `undefined` = JavaScript default for "no value yet."
- `null` = you chose to represent emptiness.
- Always use strict equality (`===`) when checking either one.
- Optional chaining (`?.`) and nullish coalescing (`??`) come in lesson `01.8.5`.

## Mini-exercise

Predict the labels:

```js
function label(value) {
  if (value === undefined) return "missing";
  if (value === null) return "empty";
  return "has-value";
}

console.log(label(undefined));
console.log(label(null));
console.log(label(""));
console.log(label(0));
```
