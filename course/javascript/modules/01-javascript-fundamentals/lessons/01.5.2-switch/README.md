# switch

> Graph index: `01.5.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.5.2-switch:README.md -->

## Context

`switch` selects one branch based on a **single value**. It is cleaner than a long `if / else if` chain when comparing one variable against many constants — menu choices, command codes, or letter grades.

## Basic switch

```js
const day = 3;
let label;

switch (day) {
  case 1:
    label = "Mon";
    break;
  case 2:
    label = "Tue";
    break;
  case 3:
    label = "Wed";
    break;
  default:
    label = "Unknown";
}

console.log(label); // Wed
```

## break is required

Without `break`, execution **falls through** to the next case:

```js
const x = 1;
switch (x) {
  case 1:
    console.log("one");
    // missing break — falls through!
  case 2:
    console.log("two");
    break;
}
// prints "one" then "two"
```

## Strict matching

`switch` uses `===` (strict equality) on each `case`:

```js
const code = "1";
switch (code) {
  case 1:
    console.log("number");
    break;
  case "1":
    console.log("string");
    break;
}
// prints "string" — case 1 does not match "1"
```

## When to prefer switch

Use `switch` when one expression maps to fixed options. Use `if / else if` for ranges (`score >= 90`) or complex conditions.

## Predict first

What is printed?

```js
const cmd = "quit";

switch (cmd) {
  case "start":
    console.log("Starting");
    break;
  case "quit":
    console.log("Goodbye");
    break;
  default:
    console.log("Unknown command");
}
```

## What to observe

- Always `break` unless fall-through is intentional (rare).
- `default` catches unmatched values — good for invalid menu input.
- Cases must be constants (`"A"`, `1`, `true`) — not ranges.
- For numeric ranges (grades), `if / else if` is usually clearer than `switch`.

## Mini-exercise

Predict for `option = 2`:

```js
const option = 2;

switch (option) {
  case 1:
    console.log("Add");
    break;
  case 2:
    console.log("Remove");
    break;
  case 3:
    console.log("List");
    break;
  default:
    console.log("Invalid");
}
```
