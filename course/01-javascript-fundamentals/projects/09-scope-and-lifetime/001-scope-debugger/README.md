# Scope Debugger

## Problem context

Junior devs confuse shadowed variables. You will build a script that logs values from nested blocks to practice scope chain reasoning.

## Goal

Implement `runScopeDemo()` with outer `let x = 1`, inner block `let x = 2`, and logs proving shadowing; add `peek(outerX)` that logs parameter from caller.

## Functional requirements

- [ ] `runScopeDemo()` logs inner `x` then outer `x` (1 then 2 order reversed: inner 2, outer 1)
- [ ] `function peek(label, value)` logs `` `${label}=${value}` ``
- [ ] `main()` calls `runScopeDemo()` then `peek("done", 0)`

## Non-functional requirements

- [ ] Only `let`/`const` (no `var`)
- [ ] Comments label which scope each `x` belongs to

## Constraints

- One file

## Acceptance criteria

- [ ] Output matches predicted shadowing
- [ ] Drawing: two `x` bindings in one `runScopeDemo` frame environment
- [ ] `peek` frame sits above `main` when called from `main`

## Example data

```text
inner x=2
outer x=1
done=0
```

## Suggested plan

1. Write nested blocks; predict logs.
2. Add `peek`; trace `main` → `peek`.
3. Optional `ReferenceError` from inner-only variable.

## Deliverables

- [ ] `starter/index.js`

## Extensions

- [ ] Function `inner()` inside `runScopeDemo` that reads outer `x` without shadowing
