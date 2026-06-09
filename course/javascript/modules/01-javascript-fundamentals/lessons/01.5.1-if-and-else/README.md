# if and else

> Graph index: `01.5.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.5.1-if-and-else:README.md -->

## Context

`if` runs code only when a condition is true. `else if` and `else` handle alternative branches. Grade classifiers, validators, and error messages in CLI tools all depend on clear branching with inclusive boundaries.

## Basic if

```js
const score = 85;

if (score >= 60) {
  console.log("Pass");
}
```

## if / else

```js
const age = 15;

if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
```

## if / else if / else

```js
const score = 85;
let grade;

if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else if (score >= 70) {
  grade = "C";
} else {
  grade = "F";
}

console.log("Grade:", grade);
```

## Early error branch

```js
const raw = "abc";
const score = Number(raw);

if (!Number.isFinite(score)) {
  console.log("ERROR: invalid score");
} else if (score < 0 || score > 100) {
  console.log("ERROR: score out of range");
} else {
  console.log("Grade: B");
}
```

Print one clear `ERROR:` line and stop — do not fall through to success output.

## Predict first

What is printed for `score = 90`?

```js
const score = 90;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else {
  console.log("F");
}
```

## What to observe

- Conditions use booleans — comparisons, `&&`, `||`, or variables like `isValid`.
- Order matters: check **most specific / highest** thresholds first when using `else if`.
- Boundaries: `>= 90` includes 90; test edge values (89, 90, 100).
- Validate input in an early branch before computing the happy path.

## Mini-exercise

Predict for `score = 89`:

```js
const score = 89;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
```
