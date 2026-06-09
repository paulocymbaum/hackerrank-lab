# Default Config Builder

## Problem context
Service configs merge user overrides with safe defaults. `??` preserves `0` and `false`; `||` treats empty strings as missing — pick the right operator per field.

## Goal
Read four optional config fields and print a normalized config object using `??` and `||`.

## Functional requirements
- [ ] Read four lines: `retries`, `timeout`, `label`, `active`.
- [ ] Each line may be:
  - [ ] empty (after trim) → treat as `undefined`
  - [ ] `null` → JavaScript `null`
  - [ ] any other text → use as raw value
- [ ] Normalization (implement `buildConfig(raw)` returning an object):
  - [ ] `retries`: `Number(raw.retries)` when provided and finite; if nullish input → `3`
  - [ ] `timeout`: `Number(raw.timeout)` when provided and finite; if nullish input → `5000` (`0` must stay `0`)
  - [ ] `label`: trim string; if nullish → `""`; then `label || "default"`
  - [ ] `active`: if nullish → `false`; if `"true"`/`"false"` → boolean; else → `ERROR: invalid active`
- [ ] Invalid `retries` or `timeout` number → `ERROR: invalid number`.
- [ ] Print four lines:
  - [ ] `retries: <n>`
  - [ ] `timeout: <n>`
  - [ ] `label: <text>`
  - [ ] `active: <true|false>`

## Non-functional requirements
- [ ] Use `??` for nullish defaults on numeric fields
- [ ] Use `||` only where empty string should fall back to `"default"`

## Constraints
- [ ] Node.js only
- [ ] `buildConfig` returns a plain object; `main` handles printing

## Acceptance criteria
- [ ] empty, empty, empty, empty → `3`, `5000`, `default`, `false`
- [ ] `0`, `0`, ``, `true` → `0`, `0`, `default`, `true`
- [ ] `5`, `null`, `  api  `, `false` → `5`, `5000`, `api`, `false`
- [ ] `x`, `100`, `ok`, `true` → error on retries

## Example data

Input:
- (empty)
- (empty)
- (empty)
- (empty)

Output:
```
retries: 3
timeout: 5000
label: default
active: false
```

## Suggested plan (no solution)
1. Map each stdin line to `undefined`, `null`, or string value.
2. In `buildConfig`, apply `??` for numeric defaults after parsing.
3. Apply `|| "default"` only on `label` after trim.
4. Print labeled fields from the returned object.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Use optional chaining when reading nested `raw.meta?.label`.
