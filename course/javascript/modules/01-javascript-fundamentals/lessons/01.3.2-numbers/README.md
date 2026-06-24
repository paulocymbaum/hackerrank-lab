# Numbers

> Graph index: `01.3.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.3.2-numbers:README.md -->

## Context

stdin lines arrive as **strings**. Before doing math you must parse them into numbers. Billing and score tools also need clean display — two decimal places for money, rejection of invalid input.

## Creating numbers

```js
const a = 42;
const b = 3.14;
const fromString = Number("100");
console.log(fromString + 1); // 101
```

## Parsing stdin-like strings

```js
const line = "  42.5  ";
const n = Number(line.trim());
console.log(n); // 42.5

const bad = Number("abc");
console.log(bad); // NaN
```

## Checking validity

```js
const input = "12.5";
const value = Number(input);

if (!Number.isFinite(value)) {
  console.log("ERROR: invalid number");
} else {
  console.log("OK:", value);
}
```

`Number.isFinite(x)` is `false` for `NaN`, `Infinity`, and non-numbers.

## Formatting money

```js
const share = 10 / 3;
console.log("Share: $" + share.toFixed(2)); // Share: $3.33
```

`toFixed(2)` returns a **string** with exactly two decimal places.

## Predict first

What is printed?

```js
console.log(Number("10") + 5);
console.log(Number("") + 5);
console.log(Number.isFinite(Number("abc")));
console.log((7 / 2).toFixed(2));
```

## What to observe

- Always parse stdin with `Number()` (or `parseInt` / `parseFloat` when you need specific rules).
- `NaN` poisons math — validate early with `Number.isFinite`.
- `toFixed(n)` is for **display**, not precise financial math in production.
- Empty string `""` becomes `0` with `Number("")` — trim and validate emptiness separately.

## Mini-exercise

Predict the output for input lines `100` and `4`:

```js
const total = Number("100");
const people = Number("4");
const share = total / people;
console.log("Share: $" + share.toFixed(2));
```
