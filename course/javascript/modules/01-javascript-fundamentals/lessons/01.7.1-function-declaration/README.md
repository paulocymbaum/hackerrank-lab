# Function Declaration

> Graph index: `01.7.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.7.1-function-declaration:README.md -->

## Context

Functions bundle reusable logic with a name. Instead of copying the same conversion or validation in every script, you declare once and call many times. HackerRank solutions stay shorter and easier to test when helpers are extracted.

## Declaring a function

```js
function greet(name) {
  console.log("Hello, " + name);
}

greet("Ana");
greet("Bob");
```

## Function with return

```js
function double(n) {
  return n * 2;
}

const result = double(5);
console.log(result); // 10
```

`return` sends a value back to the caller. Without `return`, the result is `undefined`.

## Reuse in calculations

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * (5 / 9);
}

console.log(toCelsius(32));  // 0
console.log(toCelsius(212)); // 100
```

## Hoisting (one-line note)

Function declarations are hoisted — you can call them before the line they appear on in the file. Prefer declaring helpers near the top for readability anyway.

## Predict first

What is printed?

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));
console.log(add(10, 1));
```

## What to observe

- Name functions by what they do: `toCelsius`, `isValidScore`, `formatTotal`.
- One function, one job — easier to debug and reuse.
- Call with `name(args)`; define with `function name(params) { ... }`.
- Return computed values; let the caller decide whether to `console.log`.

## Mini-exercise

Predict the output:

```js
function celsiusToFahrenheit(c) {
  return c * (9 / 5) + 32;
}

console.log(celsiusToFahrenheit(0));
console.log(celsiusToFahrenheit(100));
```
