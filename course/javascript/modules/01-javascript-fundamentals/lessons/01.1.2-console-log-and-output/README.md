# console.log and Output

> Graph index: `01.1.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.1.2-console-log-and-output:README.md -->

## Context

Readable output matters in CLI tools and coding challenges. Stakeholders should see **labeled**, **consistent** lines — not mystery values.

## console.log basics

```js
const item = "Coffee";
const qty = 2;
const price = 3.5;

console.log("Item:", item);
console.log("Qty:", qty);
console.log("Total:", qty * price);
```

`console.log` prints to **stdout** and adds a newline at the end.

## Formatting numbers as money

```js
const total = 12.7;
console.log("Total: $" + total.toFixed(2)); // Total: $12.70
```

`toFixed(2)` always shows two decimal places (returns a string).

## Predict first

What is printed?

```js
console.log("A");
process.stdout.write("B");
console.log("C");
```

## What to observe

- `console.log(x)` is like `process.stdout.write(String(x) + "\n")`.
- Mixing raw writes and `console.log` can produce surprising line breaks.
- Label every value in exercise output (`Item:`, `Qty:`, `ERROR:`) so reviewers can scan results quickly.
- Validation errors should be **one clear line** on stdout (or stderr in larger apps; challenges usually expect stdout).

## Template literals for labels

```js
const name = "Notebook";
const total = 12.75;
console.log(`Item: ${name}`);
console.log(`Total: $${total.toFixed(2)}`);
```

## Mini-exercise

Predict the four lines for input `Pen`, `3`, `4.25`:

```js
const lines = ["Pen", "3", "4.25"];
const item = lines[0].trim();
const qty = Number(lines[1]);
const unit = Number(lines[2]);
const total = qty * unit;

console.log(`Item: ${item}`);
console.log(`Qty: ${qty}`);
console.log(`Unit: $${unit.toFixed(2)}`);
console.log(`Total: $${total.toFixed(2)}`);
```
