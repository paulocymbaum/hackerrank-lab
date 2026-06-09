# Parameters and Return Values

> Graph index: `01.7.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.7.2-parameters-and-return-values:README.md -->

## Context

Parameters are inputs to a function; `return` sends a result back. Separating **computation** (return a value) from **output** (`console.log`) makes functions testable and reusable across different CLI scripts.

## Parameters

```js
function greet(name, greeting) {
  return greeting + ", " + name + "!";
}

console.log(greet("Ana", "Hello"));
console.log(greet("Bob", "Hi"));
```

Arguments are matched to parameters in order.

## Missing arguments become undefined

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));   // 5
console.log(add(2));      // NaN — b is undefined
```

Always validate parameters when input must be present.

## Early return

```js
function classify(score) {
  if (!Number.isFinite(score)) {
    return "ERROR";
  }
  if (score >= 60) {
    return "Pass";
  }
  return "Fail";
}

console.log(classify(85));
console.log(classify("x"));
```

`return` exits the function immediately — no code below runs.

## Return vs console.log

```js
// Good — caller decides output
function formatShare(amount) {
  return "Share: $" + amount.toFixed(2);
}
console.log(formatShare(25));

// Less flexible — always prints inside
function printShare(amount) {
  console.log("Share: $" + amount.toFixed(2));
}
```

## Predict first

What is printed?

```js
function max(a, b) {
  if (a >= b) {
    return a;
  }
  return b;
}

console.log(max(3, 7));
console.log(max(10, 2));
```

## What to observe

- Parameter count and order matter — document what each parameter means.
- Use early `return` for invalid input instead of deep nesting.
- Prefer returning values over printing inside helpers.
- A function without `return` (or with bare `return;`) gives `undefined` to the caller.

## Mini-exercise

Predict each line:

```js
function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

console.log(clamp(5, 0, 10));
console.log(clamp(-3, 0, 10));
console.log(clamp(99, 0, 10));
```
