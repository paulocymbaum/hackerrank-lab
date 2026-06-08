# Comment and Log Journal

## Problem context

Support engineers trace incidents using timestamped logs. You need a tiny script that documents steps with comments and labeled `console.log` lines.

## Goal

Print a three-step “journal” (start, work, done) from one function, with comments explaining each step.

## Functional requirements

- [ ] `function journal()` logs exactly three labeled lines: `[start]`, `[work]`, `[done]`
- [ ] Each step has a single-line comment above it in code
- [ ] Call `journal()` once at module level

## Non-functional requirements

- [ ] Labels make order obvious in output
- [ ] No unused variables

## Constraints

- Node only; single file `starter/index.js`

## Acceptance criteria

- [ ] Output shows three lines in order
- [ ] You can draw the stack when `[work]` prints (one frame: `journal`)
- [ ] Optional: cause `ReferenceError` by logging undefined variable; paste trace

## Example data

```text
[start] boot
[work] processing
[done] exit
```

## Suggested plan

1. Stub three logs; run.
2. Wrap in `journal`; add comments.
3. Break once on purpose; read trace.

## Deliverables

- [ ] `starter/index.js`

## Extensions

- [ ] Prefix each line with `Date.now()`
