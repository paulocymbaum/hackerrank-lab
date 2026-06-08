<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/02-first-steps.md -->

# Lesson 02 — First steps

**Graph:** `First steps` → `console.log`, Comments, Common errors and error messages

## Motivação

`console.log` is your microscope: output order reveals execution order. Comments document intent; error **names** (`SyntaxError`, `ReferenceError`) tell you which stage failed.

## 1) Stack-first: `console.log` runs in the current frame

**What:** `console.log` is a function call — it executes synchronously in whatever frame is active.

**How:**

```js
function step(label) {
  console.log(label);
}
step("A");
step("B");
```

| Step | Stack (top first) | Output |
|------|-------------------|--------|
| Call `step("A")` | `step` → `(module)` | A |
| Return, call `step("B")` | `step` → `(module)` | B |

**Why:** Misreading order means not tracking which frame is running — not “random” logging.

### Mental model summary

- Comments are stripped before run; never affect the stack.
- `SyntaxError` = invalid code (no frames run).
- `ReferenceError` = name not found in scope chain.

## Definições

| Error | Typical cause |
|-------|----------------|
| SyntaxError | Typo, missing `)` |
| ReferenceError | Variable used before declared |
| TypeError | Operation on wrong type |

```js
// comment
console.log(1 + 1);
/* block comment */
```

## Anti-padrões

- Logging without labels in multi-step scripts.
- Ignoring the error **type** and only reading the message.

## Predict-first

1. Swap the two `step(...)` calls — predict order.
2. Will `console.log(x)` run if `let x` is declared on the next line? (preview lesson 09)

## Mini exercise

- [ ] Script with 3 labeled logs inside one function.
- [ ] Trigger one `ReferenceError`; paste trace and identify top frame.

## Checklist

- [ ] Use single-line and block comments
- [ ] Classify SyntaxError vs ReferenceError from message
