# Hello Stdin

## Problem context
You are onboarding to a team that solves HackerRank-style problems in Node.js. Your first task is a tiny CLI that reads input from `stdin` and prints a greeting — the same I/O pattern used in most coding challenges.

## Goal
## Lesson concepts practiced
- [ ] Input from HackerRank arrives as **strings** — even numbers.
- [ ] Always **trim** user input before validating emptiness.
- [ ] `rl.close()` ends the program cleanly after handling one line.

Build a Node.js program that reads one line from `stdin` and prints a formatted greeting to `stdout`.

## Functional requirements
- [ ] Read exactly one line from `stdin` (the user's name).
- [ ] Trim leading and trailing whitespace from the input.
- [ ] If the line is empty after trim, print `ERROR: name is required`.
- [ ] Otherwise print `Hello, <name>!` on a single line.

## Non-functional requirements
- [ ] Readability and maintainability
- [ ] Clear error message for missing input
- [ ] No external dependencies

## Constraints
- [ ] Node.js only (no external libraries)
- [ ] Use `process.stdin` / `readline` or buffered read — no `prompt()` in browser
- [ ] Output must be exactly one line (no extra blank lines)

## Acceptance criteria
- [ ] Input `Alice` → `Hello, Alice!`
- [ ] Input `  Bob  ` → `Hello, Bob!`
- [ ] Input `` (empty line) → `ERROR: name is required`
- [ ] Input with only spaces → `ERROR: name is required`

## Example data

### Valid input
Input:
- `Maria`

Output:
- `Hello, Maria!`

### Invalid input
Input:
- ``

Output:
- `ERROR: name is required`

## Suggested plan (no solution)
1. Set up a `readline` interface on `process.stdin`.
2. On the first `line` event, trim the value.
3. Branch on empty vs non-empty and write the result to `stdout`.
4. Close the interface and exit.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept a second line with a language code (`en`, `pt`) and greet in that language.
- [ ] Reject names longer than 50 characters with a specific error message.
