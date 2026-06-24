# User Badge Formatter

## Problem context
A dashboard shows compact user badges in logs and CLI tools. Names arrive messy (extra spaces, mixed case) and handles must be URL-safe.

## Goal
Implement `formatUserBadge(user)` that returns a single-line badge string built from string primitives and template literals.

## Functional requirements
- [ ] `user` has `{ displayName: string, handle: string, level: number }`.
- [ ] Normalize `displayName`: trim and collapse internal runs of spaces to one space.
- [ ] Normalize `handle`: trim, lowercase, remove leading `@` if present.
- [ ] Validate `level`: must be a finite integer `>= 1`; otherwise throw `Error` with message `invalid level`.
- [ ] Return format: `[L<level>] <displayName> (@<handle>)`
- [ ] If `displayName` is empty after normalization, throw `Error` with message `displayName is required`.

## Non-functional requirements
- [ ] Readability and maintainability
- [ ] Pure function (no I/O side effects)
- [ ] Clear error messages

## Constraints
- [ ] No external libraries
- [ ] Use template literals for the final badge string
- [ ] Export `formatUserBadge` from `starter/index.js`

## Acceptance criteria
- [ ] `{ displayName: "  Ana   Silva ", handle: "@AnaS", level: 3 }` → `[L3] Ana Silva (@anas)`
- [ ] `{ displayName: "Bob", handle: "bob", level: 1 }` → `[L1] Bob (@bob)`
- [ ] `{ displayName: "   ", handle: "x", level: 2 }` throws `displayName is required`
- [ ] `{ displayName: "Eve", handle: "eve", level: 0 }` throws `invalid level`

## Example data

Input:

```js
formatUserBadge({ displayName: "  João  ", handle: "@JOAO", level: 12 })
```

Output:

```js
"[L12] João (@joao)"
```

## Suggested plan (no solution)
1. Trim and collapse spaces in `displayName` (split/filter/join or regex).
2. Strip `@`, trim, lowercase `handle`.
3. Validate `level` with `Number.isInteger` and range check.
4. Return template literal `[L${level}] ${displayName} (@${handle})`.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add optional `verified: boolean` — append ` ✓` when true.
- [ ] Truncate `displayName` to 24 characters with `…` when longer.
