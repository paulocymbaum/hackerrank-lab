<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/05-control-flow.md -->

# Lesson 05 — Control flow

**Graph:** `Control flow` → `if/else`, `switch`, loops (`for`, `while`)

## Motivação

Branching and loops express decisions and repetition. They run **inside** the current frame — only function **calls** add frames.

## 1) Stack-first: `if` and `for` do not push frames

**What:** Control structures change **which line runs next** in the same frame.

**How:**

```js
function classify(n) {
  if (n < 0) return "neg";
  for (let i = 0; i < 1; i++) {
    return "loop-once";
  }
  return "pos";
}
```

| Region | Frames |
|--------|--------|
| All of `classify` | Only `classify` on stack (no frame per loop iteration) |
| `return` inside `for` | Pops `classify` immediately |

**Why:** `return` anywhere in a function ends that frame.

### Mental model summary

- `if/else`, `switch`, `for`, `while` = same frame.
- `break` exits loop; `continue` skips to next iteration.

## Anti-padrões

- Missing `break` in `switch` (fall-through bugs).
- Infinite `while` without updating the condition variable.

## Predict-first

1. `classify(3)` — which `return` runs?
2. `for (let i = 0; i < 3; i++)` — how many body executions?

## Mini exercise

- [ ] `sumUntil(n)` with `while`; log each `i`.

## Checklist

- [ ] Write `if/else` and one loop type
- [ ] Trace `return` inside a loop on paper
