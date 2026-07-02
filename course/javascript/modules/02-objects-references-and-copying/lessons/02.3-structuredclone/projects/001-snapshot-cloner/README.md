# Snapshot Cloner

## Problem context
Before sending data to another subsystem, teams often need an **immutable snapshot**. JSON cloning is tempting but lossy (`Date` → string, `undefined` dropped, `BigInt` throws).

This project builds a safe snapshot function using `structuredClone` when available, with a JSON fallback for simple data.

## Goal
## Lesson concepts practiced
- [ ] Prefer shallow copy + copy-on-write for most updates.
- [ ] Deep copy when you need an immutable snapshot boundary.
- [ ] `structuredClone` is the modern default when supported.

Implement `cloneForSafety(value)` and a CLI that reads one JSON line from stdin, clones it, and prints the clone as one JSON line — without mutating the original parsed value.

## Functional requirements
- [ ] Implement `cloneForSafety(value)`:
  - [ ] If `typeof structuredClone === "function"`, use it.
  - [ ] Otherwise clone JSON-safe data via `JSON.parse(JSON.stringify(value))`.
  - [ ] If cloning fails, throw an `Error` with a helpful message.
- [ ] CLI reads one JSON value from `stdin` (object, array, or primitive).
- [ ] Print cloned result as one JSON line to `stdout`.
- [ ] Verify the original parsed value was not mutated (compare `JSON.stringify` before/after).
- [ ] On error, print `ERROR: <message>` as one line.

## Non-functional requirements
- [ ] Readability and maintainability
- [ ] Clear error messages for unsupported data in JSON fallback
- [ ] Deterministic output for the same input

## Constraints
- [ ] Node.js only (no external dependencies)
- [ ] Do not mutate the parsed input
- [ ] JSON fallback must reject non-JSON-safe values with a clear error (e.g. `BigInt`, functions)

## Acceptance criteria
- [ ] `{ n: 1 }` clones to an equal but distinct object (`!==` original)
- [ ] `{ when: "2020-01-01T00:00:00.000Z" }` clones successfully via JSON path
- [ ] Input with `BigInt` fails gracefully when `structuredClone` is unavailable (or succeeds with `structuredClone` in modern Node)
- [ ] Original input unchanged after clone
- [ ] Uses `structuredClone` (or JSON fallback) for a deep immutable snapshot boundary

## Example data

Input:

```json
{"name":"Ana","meta":{"score":10}}
```

Output:

```json
{"name":"Ana","meta":{"score":10}}
```

(with different object identity than the parsed input)

## Suggested plan (no solution)
1. Parse stdin JSON safely.
2. Snapshot `JSON.stringify(input)` before cloning.
3. Implement `cloneForSafety` with structuredClone-first, JSON fallback second.
4. In JSON fallback, wrap `JSON.stringify` in try/catch for `BigInt`/cycles.
5. Compare before/after snapshots; fail if input mutated.
6. Print cloned value as one JSON line.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `--report` flag listing which clone strategy was used
- [ ] Document which types JSON loses vs `structuredClone` preserves
