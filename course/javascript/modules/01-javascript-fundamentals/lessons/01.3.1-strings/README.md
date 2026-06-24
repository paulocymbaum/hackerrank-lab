# Strings

> Graph index: `01.3.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.3.1-strings:README.md -->

## Context

Strings are one of the most common types in JavaScript — especially from **stdin**, forms, and APIs. Most bugs start with messy text: extra spaces, wrong case, missing trim.

## Creating and inspecting strings

```js
const name = "Ana";
const greeting = 'Hello';
const badge = `Level ${12}`; // template literal

console.log(name.length);      // 3
console.log(badge);            // "Level 12"
```

## Normalizing user text

```js
const raw = "  Ana   Silva  ";
const trimmed = raw.trim();
const collapsed = trimmed.split(/\s+/).join(" ");
console.log(collapsed); // "Ana Silva"
```

## Case and prefixes

```js
const handle = "@AnaS";
const normalized = handle.trim().replace(/^@/, "").toLowerCase();
console.log(normalized); // "anas"
```

## Predict first

What is printed?

```js
const a = "hello";
const b = "HELLO";
console.log(a === b);
console.log(a.toLowerCase() === b.toLowerCase());
console.log(`[${a}]`.length);
```

## What to observe

- Strings are **immutable** — methods return new strings.
- `trim()` only removes leading/trailing whitespace, not spaces in the middle.
- Template literals (backticks) embed expressions: `` `Hi ${name}` ``.
- Compare case-insensitively by normalizing both sides, not by guessing.

## Useful checks

```js
const email = "  ";
if (email.trim().length === 0) {
  console.log("email is empty");
}
```

## Mini-exercise

Predict the badge string:

```js
function formatBadge(displayName, handle, level) {
  const name = displayName.trim().split(/\s+/).join(" ");
  const user = handle.trim().replace(/^@/, "").toLowerCase();
  return `[L${level}] ${name} (@${user})`;
}

console.log(formatBadge("  João  ", "@JOAO", 12));
```
