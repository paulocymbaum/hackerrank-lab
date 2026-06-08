<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/06-functions.md -->

# Lesson 06 — Functions

**Graph:** `Functions` → declarations vs expressions, arrow functions, parameters, return

## Motivação

Functions are reusable stack frames. Declarations, expressions, and arrows differ in **when the binding exists** and syntax — not in push/pop behavior.

## 1) Stack-first: every call pushes; return pops

**What:** `f()` creates a frame for `f` with parameters bound to arguments.

**How:**

```js
function add(a, b) { return a + b; }
const mul = (a, b) => a * b;
function main() {
  const x = add(2, 3);
  const y = mul(x, 2);
  return y;
}
main();
```

| Step | Stack (top first) |
|------|-----------------|
| `main()` | `main` |
| `add(2,3)` | `add` → `main` |
| after `add` returns | `main` |
| `mul(x,2)` | `mul` → `main` |

**Why:** Deep chains risk “Maximum call stack size exceeded” (recursion).

### Mental model summary

- Declaration: hoisted name.
- Expression: `const f = function () {}` — exists after line runs.
- Arrow: concise; `return` implied for expression body.

## Anti-padrões

- Calling a `const` function before its line.
- Forgetting `return` (undefined result).

## Predict-first

1. Frames on stack at `return` inside `add`?
2. `main()` return value in trace above?

## Mini exercise

- [ ] `clamp(n, min, max)` as declaration, expression, and arrow.

## Checklist

- [ ] Pass parameters and return values
- [ ] Sketch stack for nested calls
