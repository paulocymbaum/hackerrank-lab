<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/01-environment-and-running-code.md -->

# Lesson 01 — Environment and running code

**Graph:** `Environment and running code` → Node.js, Browser DevTools (Console)

## Motivação

Before debugging logic, confirm **the right file runs in the right environment**. Node CLI and browser DevTools are the two places beginners execute JavaScript — both use the same call-stack rules.

## 1) Stack-first: what runs when you `node script.js`

**What:** Node executes your file top-to-bottom. Each function call **pushes** a frame; each return **pops** it. The **call stack** is LIFO (last in, first out).

**How:** Trace `run.js`:

```js
function greet(name) {
  console.log("hi", name);
}
console.log("start");
greet("Ada");
console.log("end");
```

| Step | Action | Stack (top → bottom) |
|------|--------|---------------------|
| 1 | `console.log("start")` | `(module)` |
| 2 | Call `greet("Ada")` — **PUSH** | `greet` → `(module)` |
| 3 | `console.log` inside `greet` | `greet` → `(module)` |
| 4 | `greet` returns — **POP** | `(module)` |
| 5 | `console.log("end")` | `(module)` |

**Why:** If `greet` throws, `"end"` does not run until the error is handled — the caller frame waits. Stack traces list **innermost frame first** (where the error occurred).

### Mental model summary

- `node file.js` = one synchronous run through top-level code (until async is introduced later).
- Call = push frame; return = pop frame.
- Wrong `cwd` or path = file never runs — not a language bug.

## Definições e termos

| Term | Meaning |
|------|---------|
| Node.js | JS runtime outside the browser |
| `(module)` frame | Top-level code in your file |
| Stack trace | Snapshot of frames at error time |

## Environment topics

- **Node:** `node path/to/file.js` — verify with `pwd` and `ls`.
- **Browser:** DevTools → Console for snippets; `<script src="...">` for files.
- **Version:** `node -v` — use current LTS.

## Anti-padrões

- Running `node wrong-name.js` from the wrong folder.
- Reading stack traces bottom-to-top (read **top line first**).

## Predict-first

1. Predict print order for the trace snippet above.
2. If `greet` throws on line 2, does `"end"` print? Why?

## Mini exercise (acceptance criteria)

- [ ] Create `hello.js` with a `main()` that prints your name.
- [ ] Run with Node; paste output.
- [ ] One sentence: which frame is active at the inner `console.log`?

## Checklist

- [ ] Run a script with Node from the correct directory
- [ ] Read a one-level stack trace
- [ ] Explain push/pop for one function call
