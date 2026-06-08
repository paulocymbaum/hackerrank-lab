# Unit Converter CLI

## Problem context

A fitness app stores distances in meters; users want kilometers. You will convert with explicit types and operators.

## Goal

Convert meters to kilometers and print a labeled result from `main()`.

## Functional requirements

- [ ] `const METERS_PER_KM = 1000`
- [ ] `function toKm(meters)` returns `meters / METERS_PER_KM`
- [ ] `main()` uses `const distanceM = 5000` and logs `5 km` style output

## Non-functional requirements

- [ ] Use `const` for values that do not change
- [ ] Clear number formatting in the log message

## Constraints

- No npm packages; `starter/index.js` only

## Acceptance criteria

- [ ] `node starter/index.js` prints km value `5` for 5000 meters
- [ ] Trace shows `toKm` frame pushed above `main` during conversion

## Example data

```text
5000 meters → 5 km
```

## Suggested plan

1. Implement `toKm`; test with one number.
2. Wire `main`; log template string.
3. Paper-trace push/pop for `main` → `toKm`.

## Deliverables

- [ ] `starter/index.js`

## Extensions

- [ ] Accept meters from `process.argv[2]`
