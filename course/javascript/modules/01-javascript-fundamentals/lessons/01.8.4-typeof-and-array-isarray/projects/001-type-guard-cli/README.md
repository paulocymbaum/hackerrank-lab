# Type Guard CLI

## Problem context
Validation pipelines receive mixed JSON values. You need a reliable **type label** for logging and routing — without falling into `typeof null === "object"` or treating arrays as generic objects.

## Goal
Implement `classifyValue(value)` that returns one of: `"null"`, `"array"`, `"object"`, `"string"`, `"number"`, `"boolean"`, `"undefined"`, `"function"`, `"bigint"`, `"symbol"`.

CLI reads one JSON value from `stdin` and prints the label as a plain string line.

## Functional requirements
- [ ] Implement `classifyValue(value)` with these rules:
  - [ ] `null` → `"null"` (not `"object"`)
  - [ ] Arrays → `"array"` (use `Array.isArray`)
  - [ ] Plain objects → `"object"`
  - [ ] Primitives → matching `typeof` result (`"string"`, `"number"`, `"boolean"`, `"undefined"`, `"bigint"`, `"symbol"`)
  - [ ] Functions → `"function"`
- [ ] CLI reads one JSON value from `stdin` (any JSON type).
- [ ] Print exactly one label line to `stdout`.
- [ ] On invalid JSON input, print `ERROR: invalid JSON`.

## Non-functional requirements
- [ ] Readability and maintainability
- [ ] Explicit null check before `typeof`
- [ ] Deterministic output

## Constraints
- [ ] Node.js only (no external dependencies)
- [ ] Do not use loose equality for type detection
- [ ] Order checks: `null` first, then `Array.isArray`, then remaining types

## Acceptance criteria
- [ ] `null` → `null`
- [ ] `[]` → `array`
- [ ] `{}` → `object`
- [ ] `"hi"` → `string`
- [ ] `0` → `number`
- [ ] `true` → `boolean`
- [ ] `undefined` (JSON absent value handled via parsing strategy or literal) → `undefined`

## Example data

Input (stdin):

```json
[]
```

Output (stdout):

```
array
```

Input:

```json
null
```

Output:

```
null
```

## Suggested plan (no solution)
1. Parse stdin as JSON.
2. If `value === null`, return `"null"`.
3. If `Array.isArray(value)`, return `"array"`.
4. Otherwise return `typeof value` (covers object, string, number, boolean, undefined, function, bigint, symbol).
5. Print label without extra JSON quoting.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept multiple JSON lines and print one label per line
- [ ] Reject `NaN` with a dedicated label or error
