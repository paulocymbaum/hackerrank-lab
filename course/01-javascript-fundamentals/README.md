# JavaScript Fundamentals

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:README.md -->

**Purpose:** Build a zero-to-one mental model of JavaScript syntax, values, control flow, and scope — aligned with the course graph branch **Fundamentals (start from zero)**.

## Motivação

JavaScript runs everywhere (Node, browsers, tooling). Before frameworks or interviews, you need a reliable picture of **how code executes synchronously**, how **values and bindings** work, and how to **read errors**. This module is that foundation.

## Definições e termos

| Termo | Significado |
|-------|-------------|
| Call stack | LIFO structure of active function frames |
| Frame | One function invocation (params, locals, return address) |
| Binding | Name → value association in an environment |
| Literal | Value written directly (`42`, `"hi"`) |
| Truthy / falsy | How values behave in boolean contexts |
| Scope chain | Linked environments for name lookup |

## Scope boundaries

**IN**
- Running JS with Node.js and reading errors in the console
- Values, variables, operators, strings/numbers, control flow, functions
- Arrays/objects at a practical “daily use” level
- Truthiness and a first look at `==` vs `===`
- Block scope and scope chain intuition

**OUT**
- Closures, hoisting/TDZ deep dives (module 02+)
- Async/event loop (later module)
- Frameworks, bundlers, TypeScript
- DSA interview patterns

## Lesson map (9 lessons + practice)

| # | Lesson | Practice project |
|---|--------|------------------|
| 1 | `examples/01-environment-and-running-code.md` | `projects/01-environment-and-first-steps/001-hello-cli-script` |
| 2 | `examples/02-first-steps.md` | `projects/02-first-steps/001-comment-and-log-journal` |
| 3 | `examples/03-variables-and-values.md` | `projects/03-variables-and-values/001-unit-converter-cli` |
| 4 | `examples/04-strings-and-numbers.md` | `projects/04-strings-and-numbers/001-price-formatter` |
| 5 | `examples/05-control-flow.md` | `projects/05-control-flow/001-grade-classifier` |
| 6 | `examples/06-functions.md` | `projects/06-functions/001-math-utils-library` |
| 7 | `examples/07-basic-collections.md` | `projects/07-basic-collections/001-inventory-summary` |
| 8 | `examples/08-comparisons-and-truthiness.md` | `projects/08-comparisons-and-truthiness/001-input-validator` |
| 9 | `examples/09-scope-and-lifetime.md` | `projects/09-scope-and-lifetime/001-scope-debugger` |

Study order: **01 → 09**, then complete each linked PBL. Take the lesson quiz after reading each example.

## Anti-padrões comuns (e como evitar)

- Running from the wrong directory → always `pwd` and use explicit paths
- Ignoring stack traces → read **top line first** (innermost frame)
- Using `var` in new code → prefer `const` / `let`
- Relying on `==` → default to `===`
- Mutating shared objects unintentionally → copy when needed

## Boas práticas e trade-offs

- **Small functions** with one job — easier stack traces and tests
- **`const` by default** — rebinding only when the algorithm needs it
- **Predict before run** — builds the mental model exams assume
- **Thin CLI scripts** in Node before browser complexity

## Tier 1 (Beginner)

**Rules of thumb**
- Read error messages bottom-up in the stack trace (most recent call first).
- Prefer `const`; use `let` when rebinding; avoid `var` in new code.
- Use `===` unless you explicitly want coercion.

**Predict-first**

```js
console.log("A");
function main() {
  console.log("B");
}
main();
console.log("C");
```

**Why it matters:** Most “my code didn’t run” bugs are environment/path issues or synchronous order misunderstandings.

**Checklist**
- [ ] Run a `.js` file with Node and interpret a one-level stack trace
- [ ] Declare `const`/`let` and explain when each is appropriate
- [ ] Predict output of a 5-line script before executing

## Tier 2 (Intermediate)

**Rules of thumb**
- Coercion is explicit in your head even when implicit in the language.
- Prefer array methods (`map`/`filter`) over manual index loops when clarity wins.

**Predict-first**

```js
console.log([] == false);
console.log([] === false);
```

**Checklist**
- [ ] Explain truthiness for `""`, `0`, `null`, `undefined`, `[]`
- [ ] Trace a `for` loop and an `if/else` on paper

## Tier 3 (Advanced)

**Rules of thumb**
- Scope is lexical: where code is written matters more than where it is called.
- When debugging, ask “which frame owns this binding?”

**Predict-first**

```js
let x = 1;
if (true) {
  let x = 2;
  console.log(x);
}
console.log(x);
```

**Checklist**
- [ ] Draw block scopes for nested `{ }` and predict `x` at each line
- [ ] Relate a `ReferenceError` to “no binding in scope chain”

## Common pitfalls

- Running the wrong file path (or wrong working directory)
- Assuming `var` behaves like `let` inside blocks
- Using `==` and being surprised by coercion
- Mutating shared object references unintentionally

## Self-test (tiered)

1. **Tier 1:** Without running, list the console output order for the Tier 1 snippet; then verify with Node.
2. **Tier 2:** Explain why `[] == false` is `true` but `[] === false` is `false`.
3. **Tier 3:** Given nested blocks with `let` redeclarations, label each `x` with its scope.

## Checklist (o que dominar)

- [ ] Complete all 9 example lessons and quizzes
- [ ] Finish all 9 PBL projects in `projects/`
- [ ] Explain call stack push/pop from a 10-line script without running it
