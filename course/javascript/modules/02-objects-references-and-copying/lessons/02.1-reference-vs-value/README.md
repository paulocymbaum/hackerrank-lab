# Reference vs Value

> Graph index: `02.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:02-objects-references-and-copying/02.1-reference-vs-value:README.md -->

## Context

In JavaScript, most "weird bugs" around objects come from one fact: **variables can share the same object**. Primitives copy by value; objects alias by reference.

## Predict first

What prints?

```js
let a = 1;
let b = a;
b = 2;
console.log(a, b);
```

```js
const a = { n: 1 };
const b = a;
b.n = 2;
console.log(a.n, b.n);
```

## Explanation

Primitives copy the value:

```js
let a = 1;
let b = a;
b = 2; // reassignment — a stays 1
```

Objects create aliases:

```js
const a = { n: 1 };
const b = a;
b.n = 2; // mutation through alias — a.n is 2
```

## What to observe

- `b = a` on objects creates an **alias**, not a copy.
- **Reassignment** (`b = { n: 999 }`) points `b` elsewhere; does not copy the object.
- **Mutation** (`b.n = 2`) changes the shared object both variables reference.

## Pitfall

```js
const a = { n: 1 };
let b = a;
b = { n: 999 }; // reassignment
a.n = 2;        // mutation on original
console.log(a.n, b.n); // 2, 999
```

## Quick challenge

Which lines create a new object? Which lines mutate an existing object?
