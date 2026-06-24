# Booleans

> Graph index: `01.3.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.3.3-booleans:README.md -->

## Context

Booleans are `true` or `false`. Comparisons and validation checks produce booleans that drive `if` statements later. Storing flags (logged in, valid input, game over) keeps CLI logic readable.

## Literal booleans

```js
const isActive = true;
const hasError = false;
console.log(isActive);  // true
console.log(hasError);  // false
```

## Comparisons produce booleans

```js
const score = 85;
console.log(score >= 60);  // true
console.log(score === 100); // false
console.log(score < 0);    // false
```

## Storing validation results

```js
const raw = "  ";
const trimmed = raw.trim();
const isEmpty = trimmed.length === 0;

console.log(isEmpty); // true
if (isEmpty) {
  console.log("ERROR: name is required");
}
```

## Boolean() conversion

```js
console.log(Boolean(1));       // true
console.log(Boolean(0));       // false
console.log(Boolean("hello")); // true
console.log(Boolean(""));      // false
```

You will study truthiness in depth in lesson `01.8.1`.

## Predict first

What is printed?

```js
const age = 17;
const canVote = age >= 18;
const isTeen = age >= 13 && age <= 19;

console.log(canVote);
console.log(isTeen);
console.log(age > 18);
```

## What to observe

- Booleans answer yes/no questions: valid, empty, in range, equal.
- Name boolean variables clearly: `isValid`, `hasError`, `canSubmit`.
- Comparisons (`===`, `<`, `>=`) always return `true` or `false`.
- `if` conditions use booleans — coming next in control flow lessons.

## Mini-exercise

Predict each line:

```js
const score = 90;
const passed = score >= 60;
const perfect = score === 100;
const invalid = score < 0 || score > 100;

console.log(passed);
console.log(perfect);
console.log(invalid);
```
