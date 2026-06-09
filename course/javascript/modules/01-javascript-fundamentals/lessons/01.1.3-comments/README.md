# Comments

> Graph index: `01.1.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.1.3-comments:README.md -->

## Context

Comments are notes for **humans** — the JavaScript engine ignores them. In challenge code you will use comments to explain validation rules, mark TODO steps, and temporarily disable lines while debugging.

## Single-line comments

```js
// Read one line from stdin and trim whitespace
const name = "Ana";

console.log(name); // prints the name
// console.log("debug"); — this line does NOT run
```

Everything after `//` on that line is ignored.

## Multi-line comments

```js
/*
  Validation rules:
  - name must not be empty after trim
  - score must be 0–100
*/
const score = 85;
console.log(score);
```

Use `/* ... */` for short blocks of documentation or to comment out several lines at once.

## Comments vs code

```js
const total = 10 + 5;   // runs: total is 15
// const total = 10 + 5; // does NOT run — whole line is a comment
console.log(total);
```

## Predict first

What is printed?

```js
const a = 1;
// const a = 2;
const b = a + 3;
console.log(b);
```

## What to observe

- Comments never change program output unless they **disable** a line of code.
- Prefer `//` for one-line notes; use `/* */` for rule lists or longer notes.
- Good comments explain **why**, not what obvious code already shows.
- In HackerRank submissions, comments are fine — graders ignore them and run the executable code.

## Mini-exercise

Which lines execute?

```js
console.log("A");
// console.log("B");
/*
console.log("C");
*/
console.log("D");
```
