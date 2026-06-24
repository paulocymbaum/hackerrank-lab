# Type Coercion (==)

> Graph index: `01.8.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.8.3-type-coercion:README.md -->

## Context

Loose equality (`==`) may **coerce types** before comparing. That makes some expressions `true` when you did not expect it. Default to `===`; study `==` only to predict bugs.

## Famous `==` surprises

```js
console.log("" == 0);        // true
console.log("0" == 0);       // true
console.log(false == 0);     // true
console.log([] == 0);        // true
console.log([] == false);    // true
console.log(null == undefined); // true
```

## How to read `[] == 0`

Arrays are objects. Under `==`, the array becomes a string (`""`), then a number (`0`). The steps are easy to get wrong in your head — another reason to prefer `===`.

## Predict first

Which are `true`?

```js
console.log("0" == false);
console.log(0 == false);
console.log("" == false);
console.log([1] == 1);
```

## What to observe

- Strings often coerce to numbers in numeric contexts.
- Booleans coerce to `0` / `1` when compared to numbers.
- `null` and `undefined` only loosely equal each other (and nothing else nullish).
- `===` avoids all of this by comparing type and value directly.

## Safer habit

```js
// explicit conversion when you mean it
const n = Number(input);
if (!Number.isFinite(n)) {
  throw new Error("Invalid number");
}
```

## Mini-exercise

Predict:

```js
console.log("\t\n" == 0);
console.log([0] == false);
console.log([0] === false);
```
