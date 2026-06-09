# Assignment and Reassignment

> Graph index: `01.2.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.2.2-assignment-and-reassignment:README.md -->

## Context

The `=` operator **assigns** a value to a variable. With `let` you can assign again later; with `const` the binding is fixed but object contents can still change. Most counters and accumulators in CLI programs rely on reassignment.

## Basic assignment

```js
let score = 10;
score = 20;           // reassignment — OK with let
console.log(score);   // 20
```

## Compound operators

Shorthand when updating a variable from its current value:

```js
let total = 100;
total += 25;   // same as total = total + 25
total -= 10;   // same as total = total - 10
total *= 2;    // same as total = total * 2
console.log(total); // 230
```

## const — no rebinding

```js
const maxRetries = 3;
// maxRetries = 5; // TypeError — cannot reassign const
```

## const objects can still mutate

```js
const config = { retries: 3 };
config.retries = 5;   // allowed — property change
console.log(config.retries); // 5
// config = {};       // not allowed — rebinding
```

## Predict first

What is printed?

```js
let points = 5;
points += 10;
points -= 3;

const player = { score: 0 };
player.score += points;

console.log(points);
console.log(player.score);
```

## What to observe

- `=` is assignment, not mathematical equality (that is `===`).
- Use `let` when a value will change; use `const` when the binding should stay put.
- `+=`, `-=`, `*=`, `/=` are common in loops and score updates.
- Mutating properties on a `const` object does **not** violate `const` — only rebinding the variable does.

## Mini-exercise

Which lines throw?

```js
let count = 0;
count++;

const limits = { min: 0, max: 100 };
limits.max = 200;
count = 1;
limits = { min: 0, max: 50 };
```
