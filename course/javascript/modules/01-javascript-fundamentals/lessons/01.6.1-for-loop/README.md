# for Loop

> Graph index: `01.6.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.6.1-for-loop:README.md -->

## Context

A `for` loop repeats code a known number of times. Summing a range, printing numbered lines, and processing fixed-size input batches are classic HackerRank patterns. The loop header controls start, condition, and step.

## Classic for loop

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
// prints 0, 1, 2
```

Three parts: **init** (`let i = 0`), **test** (`i < 3`), **update** (`i++`).

## Summing a range

```js
let sum = 0;
for (let n = 1; n <= 5; n++) {
  sum += n;
}
console.log(sum); // 15  (1+2+3+4+5)
```

## Inclusive bounds

```js
// sum from 3 to 7 inclusive
let total = 0;
for (let i = 3; i <= 7; i++) {
  total += i;
}
console.log(total); // 25
```

Use `<=` when the end value should be included.

## Loop variable scope

```js
for (let i = 0; i < 2; i++) {
  console.log(i);
}
// console.log(i); // ReferenceError — i is block-scoped to the loop
```

## Predict first

What is printed?

```js
let sum = 0;
for (let i = 1; i <= 4; i++) {
  sum += i;
}
console.log(sum);
```

## What to observe

- Off-by-one bugs are common: `i < n` vs `i <= n`.
- Initialize accumulators (`sum = 0`) before the loop.
- `i++` adds 1; `i += 2` steps by 2 for even numbers only.
- Prefer `for` when you know how many iterations you need.

## Mini-exercise

Predict the sum from 2 to 6 inclusive:

```js
let sum = 0;
for (let n = 2; n <= 6; n++) {
  sum += n;
}
console.log("Sum:", sum);
```
