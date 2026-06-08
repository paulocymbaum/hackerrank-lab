<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/08-comparisons-and-truthiness.md -->

# Lesson 08 — Comparisons and truthiness

**Graph:** `Comparisons and "truthiness"` → truthy/falsy, `==` vs `===` (initial view)

## Motivação

`if` and loops coerce values to boolean. `===` avoids surprise coercion bugs that pass tests in the REPL but fail in production.

## 1) Stack-first: `if` evaluates in the current frame

**What:** `if (expr)` coerces `expr` to boolean **before** choosing a branch — same frame, no extra push.

**How:**

```js
function isEmptyString(s) {
  if (s) return false;
  return true;
}
isEmptyString("");
```

| Step | Notes |
|------|-------|
| PUSH `isEmptyString` | `s` is `""` |
| `if (s)` | `""` falsy → skip then-branch |
| `return true` | POP |

**Why:** Coercion affects **which branch runs**, not stack mechanics.

### Mental model summary

- Falsy: `false`, `0`, `""`, `null`, `undefined`, `NaN`.
- `===` no coercion; `==` coerces when types differ.
- Prefer `===`.

## Anti-padrões

- `if (arr)` to mean “non-empty array” (`[]` is truthy!).
- Using `==` without documenting intent.

## Predict-first

1. `if ([])` — body runs?
2. `[] == false` vs `[] === false`.

## Mini exercise

- [ ] `isTruthy(x)` with `Boolean(x)`; explain one surprising `==` case.

## Checklist

- [ ] List falsy values
- [ ] Default to `===`
