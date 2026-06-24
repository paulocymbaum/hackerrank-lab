# Safe Normalizer

## Problem context
Your team receives input data from multiple sources (CLI/HackerRank stdin, APIs, files). The raw data arrives as **strings** and often contains **nested objects/arrays**.

A common bug pattern is to “normalize” the input by mutating the original object (or a shallow copy) and accidentally changing data that other parts of the program still rely on.

This project trains you to build a normalizer that:
- converts types explicitly
- **does not mutate** the original input
- makes a clear, intentional choice between shallow vs deep copy

## Goal
Build a Node.js program that reads a single JSON line from `stdin`, normalizes it into a **new output object**, and prints the normalized result as one JSON line.

The key requirement is **data safety**: the original parsed input object must remain unchanged after normalization.

## Functional requirements
- [ ] Read **one line** from `stdin` (a JSON object).
- [ ] Parse the JSON safely.
- [ ] Normalize into a new object with this shape:
  - [ ] `userId`: integer number
  - [ ] `tags`: array of strings (trimmed, lowercased, no empty tags)
  - [ ] `profile`:
    - [ ] `name`: string (trimmed)
    - [ ] `age`: integer number or `null` if missing
  - [ ] `meta`:
    - [ ] `receivedAt`: ISO string (keep as string; do not create a `Date` object)
    - [ ] `source`: one of: `"cli" | "api" | "file"`
- [ ] Print the normalized object as **one JSON line** to `stdout`.
- [ ] If input is invalid, print `ERROR: <message>` as one line.

## Non-functional requirements
- [ ] Readability and maintainability
- [ ] Error handling
- [ ] No mutation: do not mutate the parsed input object (including nested objects/arrays)
- [ ] Deterministic output (same input => same output)
- [ ] Performance: avoid deep copying everything by default; copy only what you need

## Constraints
- [ ] Node.js only (no external dependencies)
- [ ] Do not use `eval`
- [ ] You may use `structuredClone` if available, but it should not be required
- [ ] Assume input JSON is at most a few KB (no streaming required)
- [ ] Treat missing fields as errors unless explicitly allowed below

## Acceptance criteria
- [ ] The program rejects invalid JSON with `ERROR: invalid JSON`.
- [ ] `userId` must be an integer after normalization; rejects otherwise.
- [ ] `tags` becomes an array of non-empty lowercase strings.
- [ ] `profile.age` accepts:
  - [ ] missing/null/empty string → `null`
  - [ ] numeric string like `"42"` → `42`
  - [ ] non-integer values are rejected
- [ ] `meta.source` must be one of `cli`, `api`, `file`.
- [ ] **No mutation proof**: if you log/compare the original parsed input before and after normalization, it is unchanged (including nested fields).

Tip: a simple way to self-check is:
- store `const before = JSON.stringify(input)`
- run normalize
- verify `JSON.stringify(input) === before`

## Example data (if applicable)
### Valid input
Input:

```json
{"userId":"001","tags":[" JS ","","Node"],"profile":{"name":" Ana ","age":"42"},"meta":{"receivedAt":"2026-05-28T00:00:00.000Z","source":"cli"}}
```

Output:

```json
{"userId":1,"tags":["js","node"],"profile":{"name":"Ana","age":42},"meta":{"receivedAt":"2026-05-28T00:00:00.000Z","source":"cli"}}
```

### Invalid input
Input:

```json
{"userId":"abc","tags":[],"profile":{"name":"Ana"},"meta":{"receivedAt":"2026-05-28T00:00:00.000Z","source":"email"}}
```

Output:

```text
ERROR: userId must be an integer
```

## Suggested plan (no solution)
1. Read `stdin`, take the first non-empty line.
2. `JSON.parse` with `try/catch`; on failure output `ERROR: invalid JSON`.
3. Validate required fields and types (be explicit: `typeof`, `Array.isArray`, `Number.isFinite`).
4. Build `output` as a **new object**; never assign into the input.
5. For nested structures, use copy-on-write:
   - create new `profile` object
   - create new `tags` array with `map/filter`
6. Print `JSON.stringify(output)`.
7. Self-check no mutation by comparing `JSON.stringify(input)` before/after.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support `tags` as a comma-separated string (e.g. `"js,node"`).
- [ ] Support `userId` already being a number.
- [ ] Add a `--strict` mode that rejects unknown fields.
- [ ] Add a `--deep-freeze` debug mode that freezes the input to catch accidental mutation.
