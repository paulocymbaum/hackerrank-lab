# while Loop

> Graph index: `01.6.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.6.2-while-loop:README.md -->

## Context

A `while` loop repeats while a condition stays true. Use it when you do not know the exact iteration count upfront — reading until a sentinel value, retrying until valid input, or draining a queue until empty.

## Basic while

```js
let count = 0;

while (count < 3) {
  console.log(count);
  count++;
}
// prints 0, 1, 2
```

The condition is checked **before** each iteration.

## Sentinel pattern

```js
const lines = ["10", "20", "0"];
let index = 0;
let sum = 0;

while (index < lines.length && lines[index] !== "0") {
  sum += Number(lines[index]);
  index++;
}
console.log(sum); // 30
```

Stop when you hit `"0"` or run out of lines.

## Avoid infinite loops

```js
let n = 0;
while (n < 5) {
  console.log(n);
  n++; // MUST update n — without this, loop never ends
}
```

Every `while` must move toward making the condition false.

## while vs for

| Use `for` when… | Use `while` when… |
|-----------------|-------------------|
| Iteration count is known | Count depends on runtime data |
| Classic index `0..n-1` | Condition may become false at any time |

## Predict first

What is printed?

```js
let x = 1;
while (x < 8) {
  console.log(x);
  x *= 2;
}
```

## What to observe

- If the condition starts false, the body never runs (zero iterations).
- Always update variables used in the condition inside the loop.
- Infinite loops hang your Node process — test with small inputs first.
- `while (true)` with an internal `break` is valid but less clear for beginners.

## Mini-exercise

Predict the final `total`:

```js
let total = 0;
let value = 1;

while (value <= 5) {
  total += value;
  value++;
}
console.log(total);
```
