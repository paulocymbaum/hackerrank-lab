# Validation Doc Block

## Problem context
A CLI validator script needs a human-readable rule list at the top of the file. Teammates should see validation rules without reading the implementation.

## Goal
Read three rule descriptions from `stdin` and print a multi-line comment block that documents them.

## Functional requirements
- [ ] Read exactly three non-empty lines: `rule1`, `rule2`, `rule3`.
- [ ] Empty line on any input → `ERROR: rule required` (single line).
- [ ] Print this shape (exact spacing inside the block):

```
/*
  Validation rules:
  - <rule1>
  - <rule2>
  - <rule3>
*/
```

- [ ] Each rule appears on its own `- ` line inside the block.
- [ ] No extra blank lines inside the block.

## Non-functional requirements
- [ ] Comments explain rules for humans — do not execute rule logic here
- [ ] Readable output for copy-paste into a `.js` file

## Constraints
- [ ] Node.js only
- [ ] Output is a comment block string via `process.stdout.write` (no `console.log` needed)

## Acceptance criteria
- [ ] Three valid lines produce the block with `- ` prefixes
- [ ] Any empty line → `ERROR: rule required`
- [ ] Rules with spaces are preserved verbatim

## Example data

Input:
- `name must not be empty after trim`
- `score must be 0–100`
- `retries must be a positive integer`

Output:
```
/*
  Validation rules:
  - name must not be empty after trim
  - score must be 0–100
  - retries must be a positive integer
*/
```

## Suggested plan (no solution)
1. Collect three lines with `readline`.
2. Reject empty trimmed lines early.
3. Build the block with a template string or concatenation.
4. Write the block once all three lines are valid.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept a fourth line `done` to finish early when piping input.
