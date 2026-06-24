# Arithmetic Operators

> Graph index: `01.4.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.4.1-arithmetic-operators:README.md -->

## Context

Arithmetic operators compute totals, averages, remainders, and powers. Challenge scripts often split bills, sum scores, or check even/odd with `%`. Watch out: `+` also joins strings.

## Basic operators

```js
console.log(10 + 3);  // 13  addition
console.log(10 - 3);  // 7   subtraction
console.log(10 * 3);  // 30  multiplication
console.log(10 / 3);  // 3.333... division
console.log(10 % 3);  // 1   remainder (modulo)
console.log(2 ** 4);  // 16  exponent
```

## String concatenation with +

```js
console.log("Score: " + 85);     // "Score: 85"
console.log("10" + 5);           // "105" — string wins
console.log(Number("10") + 5);   // 15 — parse first
```

## Division and decimals

```js
const total = 100;
const people = 4;
const share = total / people;
console.log(share);              // 25
console.log((10 / 3).toFixed(2)); // "3.33"
```

## Modulo for even/odd

```js
const n = 7;
console.log(n % 2 === 0); // false — 7 is odd
console.log(8 % 2 === 0); // true  — 8 is even
```

## Predict first

What is printed?

```js
console.log(5 + 3 * 2);
console.log((5 + 3) * 2);
console.log("Total: " + 10 + 5);
console.log("Total: " + (10 + 5));
console.log(17 % 5);
```

## What to observe

- Multiplication and division happen before addition and subtraction (use `()` to override).
- `"text" + number` concatenates; parse numbers before math on stdin input.
- `/` always produces a float when needed (`10 / 4` is `2.5`).
- `%` is remainder, not percentage — useful for wrap-around and parity checks.

## Mini-exercise

Predict the bill-split output for `total = 10`, `people = 3`:

```js
const total = 10;
const people = 3;
const share = total / people;
console.log("Share: $" + share.toFixed(2));
```
