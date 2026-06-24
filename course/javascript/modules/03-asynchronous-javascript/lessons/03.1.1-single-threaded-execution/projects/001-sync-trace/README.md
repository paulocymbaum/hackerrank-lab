# Sync Trace

## Problem context
Debugging async bugs starts with knowing what runs synchronously on the call stack before any timer fires.

## Goal
Read a snippet id from `stdin` and print the **sync-only** log order (labels that run before any `setTimeout` callback).

## Lesson concepts practiced
- [ ] Synchronous lines complete before scheduled callbacks
- [ ] `setTimeout(..., 0)` does not run during the current sync pass
- [ ] Nested timers schedule inner work only when the outer callback runs

## Functional requirements
- [ ] Hardcode at least 3 snippets identified by id: `basic`, `nested`, `chain`
- [ ] `basic`: `console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C");` — sync order `A C`
- [ ] `nested`: nested setTimeout from lesson — sync order is `1 4` only
- [ ] `chain`: three sync logs before any timer — sync order `start middle end`
- [ ] Read one line (snippet id); print `Sync order: <labels>` or `ERROR: unknown snippet`

## Non-functional requirements
- [ ] Do not execute snippets with `eval`
- [ ] Clear error for unknown ids

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] Input `basic` → `Sync order: A C`
- [ ] Input `nested` → `Sync order: 1 4`
- [ ] Input `unknown` → `ERROR: unknown snippet`
- [ ] Output lists only sync-phase logs, never timer callbacks

## Example data

Input:
- `basic`

Output:
- `Sync order: A C`

## Suggested plan (no solution)
1. Map snippet ids to hardcoded sync order strings.
2. Read stdin line and look up the map.
3. Print labeled result or error.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add snippet `chain` documenting all sync labels in a longer trace.
