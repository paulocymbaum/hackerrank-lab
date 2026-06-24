# Celsius Converter

## Problem context
A weather widget needs reusable conversion logic. Extract the formula into a function with a clear return value.

## Goal
## Lesson concepts practiced
- [ ] Name functions by what they do: `toCelsius`, `isValidScore`, `formatTotal`.
- [ ] One function, one job — easier to debug and reuse.
- [ ] Call with `name(args)`; define with `function name(params) { ... }`.

Implement `toFahrenheit(celsius)` and a small CLI that reads one number and prints the converted value.

## Functional requirements
- [ ] Implement `function toFahrenheit(celsius)` returning `celsius * 9/5 + 32`.
- [ ] Read one line from `stdin`; parse as finite number or print `ERROR: invalid temperature`.
- [ ] Print `F: <value>` with one decimal place on success.
- [ ] Export `toFahrenheit` from `starter/index.js`.

## Non-functional requirements
- [ ] Pure conversion function (no I/O inside `toFahrenheit`)
- [ ] Readable function declaration

## Constraints
- [ ] Node.js only
- [ ] Use a **function declaration** (not arrow) for `toFahrenheit`

## Acceptance criteria
- [ ] `toFahrenheit(0)` → `32`
- [ ] `toFahrenheit(100)` → `212`
- [ ] Input `37.5` → `F: 99.5`
- [ ] Input `abc` → error

## Example data

Input:
- `0`

Output:
- `F: 32.0`

## Suggested plan (no solution)
1. Write `toFahrenheit` with explicit `return`.
2. Parse stdin; validate with `Number.isFinite`.
3. Call function and format output.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `toCelsius(fahrenheit)` as a second function.
