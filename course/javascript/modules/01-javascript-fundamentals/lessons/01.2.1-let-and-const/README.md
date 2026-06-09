# let and const

> Graph index: `01.2.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.2.1-let-and-const:README.md -->

## Context

`let` and `const` declare variables with **block scope**. Prefer them over legacy `var` in modern JavaScript.

## const — bind once

```js
const maxPlayers = 4;
// maxPlayers = 5; // SyntaxError or TypeError in strict mode
```

`const` means the **binding** cannot be reassigned. It does **not** freeze object contents:

```js
const scores = { alice: 10 };
scores.alice = 15; // allowed — mutating properties is fine
// scores = {};    // not allowed — rebinding is forbidden
```

## let — reassign when needed

```js
let total = 0;
total = total + 5;
total += 3;
console.log(total); // 8
```

Use `let` when a variable will change. Use `const` by default when it will not.

## Predict first

Which lines throw or fail?

```js
const base = 100;
let bonus = 10;

bonus = bonus + 5;
base = base + 1;

const config = { retries: 3 };
config.retries = 5;
```

## What to observe

- Default to `const`; reach for `let` only when reassignment is intentional.
- `const` objects/arrays can still be **mutated** — only the variable reference is locked.
- Block scope: variables declared inside `{}` are not visible outside.
- Never use `const` for a counter you plan to increment — that needs `let`.

## Returning new data (immutable style)

```js
function addPoints(scores, playerId, delta) {
  const current = scores[playerId] ?? 0;
  return { ...scores, [playerId]: current + delta };
}

const original = { alice: 10 };
const next = addPoints(original, "alice", 5);
console.log(original.alice); // 10 — unchanged
console.log(next.alice);    // 15
```

## Mini-exercise

Predict the output:

```js
const events = [
  { playerId: "p1", delta: 10 },
  { playerId: "p2", delta: 5 },
];

const scores = {};
for (const event of events) {
  const id = event.playerId;
  const prev = scores[id] ?? 0;
  scores[id] = prev + event.delta;
}
console.log(scores);
```
