# Hello CLI Script

## Problem context

Your team ships small Node utilities. New hires must prove they can run a script locally and read a simple stack trace when something breaks.

## Goal

Build a CLI script that greets the user by name using a `main()` function, runnable with `node starter/index.js`.

## Functional requirements

- [ ] Define `function main()` that prints exactly one line: `Hello, <name>!`
- [ ] Set `name` to your first name (string constant inside `main`)
- [ ] Call `main()` at the bottom of the file
- [ ] Add a helper `function shout(message)` that `main` calls; `shout` must call `console.log`

## Non-functional requirements

- [ ] Readable function names; one responsibility per function
- [ ] No global variables except the `main()` invocation pattern

## Constraints

- Node.js only; no npm packages
- Single file: `starter/index.js`

## Acceptance criteria

- [ ] `node starter/index.js` prints `Hello, <YourName>!`
- [ ] You can name which stack frame is active inside `shout` when it logs
- [ ] Intentionally throw in `shout` once and capture the stack trace (screenshot or paste)

## Example data

```text
$ node starter/index.js
Hello, Ada!
```

## Suggested plan (no solution)

1. Stub `main` and run the file.
2. Add `shout`; trace push/pop on paper.
3. Wire `main` → `shout` → `console.log`.
4. Test error path and read trace top line.

## Deliverables

- [ ] Code in `starter/index.js`
- [ ] Optional reference in `solution/`

## Extensions (optional)

- [ ] Read name from `process.argv[2]` with a fallback default
