# Logical Operators (&&, ||, !)

> Graph index: `01.4.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.4.3-logical-operators:README.md -->

## Context

Logical operators combine boolean conditions. CLI validators often need **all** checks to pass (`&&`) or accept **any** alternative (`||`). `!` negates a condition. These operators also **short-circuit** — they may skip evaluating the right side.

## AND — &&

All parts must be true:

```js
const age = 20;
const hasId = true;
const canEnter = age >= 18 && hasId;
console.log(canEnter); // true
```

## OR — ||

At least one part must be true:

```js
const isWeekend = false;
const isHoliday = true;
const dayOff = isWeekend || isHoliday;
console.log(dayOff); // true
```

## NOT — !

```js
const isEmpty = false;
console.log(!isEmpty); // true
console.log(!true);    // false
```

## Combining validation

```js
const score = 75;
const valid = score >= 0 && score <= 100;
const highPass = score >= 90;

console.log(valid);    // true
console.log(highPass); // false
```

## Short-circuit

```js
const name = "";
const ok = name.length > 0 && name.trim().length > 0;
// if first part is false, second part is not evaluated
```

With `||`, if the left side is truthy, the right side is skipped.

## Predict first

What is printed?

```js
console.log(true && false);
console.log(true || false);
console.log(!false);
console.log(5 > 3 && 2 > 1);
console.log(5 > 10 || 2 > 1);
```

## What to observe

- `&&` needs every condition true; `||` needs at least one true.
- Use `!` sparingly — prefer positive names like `isValid` over `!isInvalid`.
- Short-circuit avoids errors (e.g. check length before accessing characters).
- `??` (nullish coalescing) is different from `||` — see lesson `01.8.5`.

## Mini-exercise

Predict for `score = 105`:

```js
const score = 105;
const valid = score >= 0 && score <= 100;
const gradeA = score >= 90 && score <= 100;

console.log(valid);
console.log(gradeA);
console.log(!valid || gradeA);
```
