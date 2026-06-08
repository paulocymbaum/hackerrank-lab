<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/04-strings-and-numbers.md -->

# Lesson 04 — Strings and numbers

**Graph:** `Strings and numbers` → template literals, `Number()`, `String()`

## Motivação

User-facing text and money-like values need safe formatting and conversion. Template literals and explicit `Number`/`String` avoid “undefined” in output.

## 1) Stack-first: conversions are function calls

**What:** `Number(x)` and `String(x)` push frames, compute, return, pop.

**How:**

```js
function formatPrice(n) {
  const label = `Price: ${n}`;
  return label;
}
formatPrice(9.5);
```

| Step | Notes |
|------|-------|
| PUSH `formatPrice` | `n` bound to `9.5` |
| Template evaluates `${n}` | reads `n` in current frame |
| RETURN | POP frame |

**Why:** `n` undefined → `"Price: undefined"` — frame still ran correctly; data was wrong.

### Mental model summary

- `` `Hello, ${name}` `` evaluates expressions in the current frame.
- `Number("12")` → `12`; `Number("12px")` → `NaN`.
- `String(42)` → `"42"`.

## Anti-padrões

- Concatenating with `+` when a template is clearer.
- Skipping `NaN` checks after `Number()`.

## Predict-first

1. `` `${1 + 2}` `` vs `1 + 2 + ""`.
2. `Number("")` — predict.

## Mini exercise

- [ ] `toCurrency(amount)` — template + `NaN` → `"invalid"`.

## Checklist

- [ ] Use template literals
- [ ] Convert safely with `Number` / `String`
