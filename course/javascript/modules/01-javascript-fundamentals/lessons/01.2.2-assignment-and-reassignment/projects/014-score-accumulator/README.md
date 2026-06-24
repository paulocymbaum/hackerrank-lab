# Score Accumulator

## Problem context
A game server updates player scores with compound assignments (`+=`, `-=`, `*=`). You need a small CLI that replays a sequence of score changes.

## Goal
## Lesson concepts practiced
- [ ] `=` is assignment, not mathematical equality (that is `===`).
- [ ] Use `let` when a value will change; use `const` when the binding should stay put.
- [ ] `+=`, `-=`, `*=`, `/=` are common in loops and score updates.

Read an initial score and a list of operations, apply each with compound assignment, and print the final total.

## Functional requirements
- [ ] Line 1: initial `score` (finite number).
- [ ] Following lines: one operation per line until `done`:
  - [ ] `+N` → `score += N`
  - [ ] `-N` → `score -= N`
  - [ ] `*N` → `score *= N`
- [ ] Invalid initial score → `ERROR: invalid score`.
- [ ] Malformed operation line → `ERROR: invalid operation`.
- [ ] Print `Total: <score>` when `done` is received.

## Non-functional requirements
- [ ] Use compound operators (`+=`, `-=`, `*=`) — not `score = score + N`
- [ ] Parse operation suffix with `Number()` and validate `Number.isFinite`

## Constraints
- [ ] Node.js only
- [ ] `N` may be negative or decimal

## Acceptance criteria
- [ ] `10`, `+5`, `-3`, `*2`, `done` → `Total: 24` ((10+5-3)*2)
- [ ] `100`, `done` → `Total: 100`
- [ ] `abc` as first line → error
- [ ] `+x` → error

## Example data

Input:
- `10`
- `+25`
- `-10`
- `*2`
- `done`

Output:
- `Total: 50`

## Suggested plan (no solution)
1. Parse initial score; validate.
2. On each line, detect prefix `+`, `-`, or `*` and parse the rest as a number.
3. Apply the matching compound assignment.
4. On `done`, print the labeled total.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support `/N` with `score /= N` and reject division by zero.
