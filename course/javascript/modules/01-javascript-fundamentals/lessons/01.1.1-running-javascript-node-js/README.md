# Running JavaScript (Node.js)

> Graph index: `01.1.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.1.1-running-javascript-node-js:README.md -->

## Context

HackerRank and most backend exercises run JavaScript with **Node.js**. You execute a file with `node starter/index.js` and communicate through **stdin** (input) and **stdout** (output).

## Running a file

```bash
node starter/index.js
```

Node reads your script top to bottom in a single process. There is no browser DOM here — only the runtime APIs Node provides (`process`, `readline`, `fs`, etc.).

## Reading stdin (HackerRank pattern)

Most challenges give you lines of text. A common pattern:

```js
const readline = require("node:readline");

const rl = readline.createInterface({ input: process.stdin });

rl.on("line", (line) => {
  console.log("You typed:", line.trim());
  rl.close();
});
```

## Predict first

What gets printed if you run this and type `  Ana  ` then press Enter?

```js
const readline = require("node:readline");
const rl = readline.createInterface({ input: process.stdin });

rl.on("line", (line) => {
  const name = line.trim();
  if (name.length === 0) {
    console.log("ERROR: name is required");
  } else {
    console.log(`Hello, ${name}!`);
  }
  rl.close();
});
```

## What to observe

- Input from HackerRank arrives as **strings** — even numbers.
- Always **trim** user input before validating emptiness.
- `rl.close()` ends the program cleanly after handling one line.
- Use `process.stdout.write` when you must avoid an extra newline; `console.log` adds `\n`.

## Mini-exercise

Predict the output for input line `42`:

```js
const readline = require("node:readline");
const rl = readline.createInterface({ input: process.stdin });

rl.on("line", (line) => {
  console.log(typeof line);
  console.log(line + 1);
  rl.close();
});
```
