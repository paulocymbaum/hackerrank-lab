# Record Filter

## Problem context
You’re filtering records coming from an API. Some fields are missing (`null`/`undefined`), some are empty strings, and some numeric fields may be `0`. A previous implementation used truthiness checks and silently dropped valid records.

## Goal
Implement a filter function with **explicit rules** and **strict comparisons** so behavior is predictable.

## Functional requirements
- [ ] Implement `filterRecords(records, options)` returning a new array.
- [ ] Each record may contain:
  - [ ] `name` (string, optional; may be empty)
  - [ ] `score` (number or string, optional; may be `0`)
  - [ ] `tag` (string|null|undefined)
- [ ] `options` supports:
  - [ ] `minScore` (number, default `0`)
  - [ ] `requireName` (boolean, default `false`)
  - [ ] `tag` (string|null, default `null`) meaning: if non-null, only keep records with that exact tag
- [ ] Rules (be explicit):
  - [ ] Convert `score` using `Number(...)`. If result is not finite, treat record score as missing.
  - [ ] A record passes `minScore` if it has a finite score AND `score >= minScore`.
  - [ ] If `requireName` is true, keep only records where `name` is a non-empty string after trim.
  - [ ] If `options.tag` is not null, keep only records where `record.tag === options.tag`.

## Non-functional requirements
- [ ] No loose equality comparisons for filtering logic
- [ ] Clear, readable conditions (prefer helper functions)

## Constraints
- [ ] No external libraries

## Acceptance criteria
- [ ] A record with score `0` is not dropped if `minScore` is `0`.
- [ ] A record with `name: \"   \"` fails `requireName`.
- [ ] Tag filtering uses strict equality.

## Example data

Input:

```js
const records = [
  { name: "Ana", score: "0", tag: "A" },
  { name: "", score: 10, tag: "A" },
  { name: "Bob", score: "x", tag: "B" },
  { name: "Cara", score: 5, tag: null },
];

filterRecords(records, { minScore: 0, requireName: true, tag: "A" });
```

Expected output:

```js
[{ name: "Ana", score: "0", tag: "A" }]
```

## Suggested plan (no solution)
1. Normalize `options` defaults.
2. Write small helpers: `isNonEmptyString`, `toFiniteNumberOrNull`.
3. Apply each rule as an explicit boolean check.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `debug` option that returns `{ kept, dropped, reasons }`.
