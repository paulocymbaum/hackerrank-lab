<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/09-scope-and-lifetime.md -->

# Lesson 09 — Scope and lifetime

**Graph:** `Scope and lifetime` → block scope (`let`/`const`), scope chain (intuition)

## Motivação

Names resolve **lexically** — by where code is written. Block scope prevents leaks and enables shadowing; the scope chain explains `ReferenceError`.

## 1) Stack-first: blocks inside one frame

**What:** `{ }` with `let`/`const` creates inner environments linked to the outer one. Still **one function frame** unless you call another function.

**How:**

```js
function demo() {
  let x = 1;
  {
    let x = 2;
    console.log(x);
  }
  console.log(x);
}
demo();
```

| Line | Binding used |
|------|----------------|
| inner log | block `x` → `2` |
| outer log | function `x` → `1` |

**Why:** `ReferenceError` = name not found on scope chain.

### Mental model summary

- Inner blocks read outer bindings; outer cannot read inner-only bindings.
- Shadowing: inner `let x` hides outer `x` inside that block.
- Lifetime ends when environment unreachable (frame popped; closures later).

## Anti-padrões

- Using `var` in blocks expecting block scope.
- Assuming loop `var` is per-iteration (it is not).

## Predict-first

1. Both logs in `demo()` above?
2. Can `inner` read a `let` only declared in a sibling block?

## Mini exercise

- [ ] Draw scope boxes for function + two nested blocks.

## Checklist

- [ ] Explain block scope for `let`/`const`
- [ ] Predict shadowing output
