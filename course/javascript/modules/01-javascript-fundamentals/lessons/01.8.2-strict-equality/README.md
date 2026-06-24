<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/02-equality-and-coercion.md -->

# Equality: `==` vs `===` and Coercion

## Context
- `===` compares **type + value** (no coercion).
- `==` may coerce types before comparing.

## Code (predict-first)

```js
console.log("0" == 0);
console.log("0" === 0);

console.log("" == 0);
console.log(false == 0);

console.log([] == 0);
console.log([] == false);
console.log(Boolean([]));

console.log({} == {});
```

## What to notice
- `==` can convert strings/booleans/arrays into numbers.
- `[]` becomes `""`, then `0` in certain comparisons.
- Two object literals are never equal by value: `{}` and `{}` are different references.

## Safer patterns

```js
// default
if (a === b) {
  // ...
}

// explicit conversions
const n = Number(input);
if (!Number.isFinite(n)) throw new Error("Invalid number");
```

## Mini-exercise
Which of these are true?

```js
console.log([1] == 1);
console.log([1] === 1);
console.log("\\t\\n" == 0);
```
