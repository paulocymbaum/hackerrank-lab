<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/03-variables-and-values.md -->

# Lesson 03 — Variables and values

**Graph:** `Variables and values` → `let`/`const`/`var`, primitives, basic operators

## Motivação

Programs store state in **bindings**. Choosing `const` vs `let` and knowing primitive types prevents silent bugs in calculations and comparisons.

## 1) Stack-first: bindings live in frames

**What:** Each frame has an environment mapping names to values. `const a = 1` creates a binding in the **current** frame.

**How:**

```js
function demo() {
  const a = 1;
  let b = 2;
  console.log(a + b);
}
demo();
```

| Event | Stack |
|-------|-------|
| PUSH `demo` | `a`, `b` created in `demo` frame |
| `console.log` | reads `a`, `b` from `demo` |
| POP `demo` | bindings discarded |

**Why:** Locals do not exist after return — the frame is gone.

### Mental model summary

- `const` = no rebinding; `let` = rebind allowed; `var` = function-scoped (avoid in new code).
- Primitives: string, number, boolean, null, undefined.
- `+` with string can concatenate: `2 + "2"` → `"22"`.

## Definições

```js
const PI = 3.14;
let count = 0;
count += 1;
```

## Anti-padrões

- Reassigning `const`.
- Assuming `var` is block-scoped.

## Predict-first

1. `console.log(2 + "2")` — predict, then run.
2. After `demo()` returns, can outer code read `a`?

## Mini exercise

- [ ] Function with three primitives and `%` / `**`; log from inside the function.

## Checklist

- [ ] Pick `const` vs `let` correctly
- [ ] Name all five primitive types
