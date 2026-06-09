# Comparison Operators

> Graph index: `01.4.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.4.2-comparison-operators:README.md -->

## Context

Comparison operators return `true` or `false`. They power validation (`score >= 0`), sorting decisions, and grade boundaries. Default to **strict** equality (`===`) to avoid surprise type coercion.

## Relational operators

```js
console.log(5 > 3);   // true
console.log(5 < 3);   // false
console.log(5 >= 5);  // true
console.log(5 <= 4);  // false
```

## Strict equality === and !==

```js
console.log(5 === 5);     // true  same type and value
console.log(5 === "5");   // false different types
console.log(5 !== "5");   // true
```

## Loose equality == (avoid by default)

```js
console.log(5 == "5");  // true — coerces types
console.log(5 === "5"); // false — preferred
```

Coercion rules are covered in lessons `01.8.2` and `01.8.3`.

## Boundary checks

```js
const score = 90;
const inRange = score >= 0 && score <= 100;
const isA = score >= 90 && score <= 100;
console.log(inRange); // true
console.log(isA);     // true
```

Inclusive lower bound: `90 >= 90` is `true`.

## Predict first

What is printed?

```js
console.log(10 === 10);
console.log(10 == "10");
console.log(10 === "10");
console.log(89 >= 90);
console.log(90 >= 90);
```

## What to observe

- Use `===` and `!==` unless you explicitly need coercion.
- Boundary bugs are common: decide whether limits are inclusive (`>=`, `<=`).
- Comparisons return booleans — store them in variables like `isValid`.
- String comparison uses lexicographic order — parse numbers before comparing numeric input.

## Mini-exercise

Predict the grade check for `score = 89`:

```js
const score = 89;
console.log(score >= 90);
console.log(score >= 80 && score <= 89);
console.log(score === "89");
```
