# Menu Command Router

## Problem context
A text-based admin console routes user commands to actions. A `switch` keeps each command branch explicit and easy to extend.

## Goal
## Lesson concepts practiced
- [ ] Always `break` unless fall-through is intentional (rare).
- [ ] `default` catches unmatched values — good for invalid menu input.
- [ ] Cases must be constants (`"A"`, `1`, `true`) — not ranges.

Read one command string and print the matching action message using `switch`.

## Functional requirements
- [ ] Read one trimmed line `cmd`.
- [ ] Routes (exact match, case-sensitive):
  - [ ] `start` → `Starting`
  - [ ] `quit` → `Goodbye`
  - [ ] `help` → `Help available`
  - [ ] anything else → `Unknown command`
- [ ] Each matching `case` must use `break`.

## Non-functional requirements
- [ ] Use `switch` — not a chain of `if / else if`
- [ ] Include a `default` branch for unknown commands

## Constraints
- [ ] Node.js only
- [ ] Strict string matching (`===` via `switch`)

## Acceptance criteria
- [ ] `start` → `Starting`
- [ ] `quit` → `Goodbye`
- [ ] `help` → `Help available`
- [ ] `pause` → `Unknown command`
- [ ] `Start` → `Unknown command` (case-sensitive)

## Example data

Input:
- `quit`

Output:
- `Goodbye`

## Suggested plan (no solution)
1. Trim the command line.
2. `switch (cmd)` with one `case` per known command.
3. `break` after each case body.
4. `default` prints unknown message.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `list` → `Listing items` and document intentional fall-through for `list` + `help`.
