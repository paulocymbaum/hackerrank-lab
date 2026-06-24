# Leaderboard Scores

## Problem context
A game backend tracks player scores. A junior dev used `const` everywhere and reassignment broke production. You need a small score updater that uses `let` and `const` correctly.

## Goal
Implement `updateLeaderboard(initialScores, events)` that applies a list of score events and returns the final leaderboard object without mutating the input.

## Functional requirements
- [ ] `initialScores` is an object `{ [playerId: string]: number }`.
- [ ] `events` is an array of `{ playerId: string, delta: number }`.
- [ ] Return a **new** object with updated scores (do not mutate `initialScores`).
- [ ] Use `const` for bindings that are never reassigned; use `let` only when reassignment is required.
- [ ] Unknown `playerId` in an event starts at `0` before applying `delta`.
- [ ] Print nothing — return the object only (tests call the function).

## Non-functional requirements
- [ ] Readability and maintainability
- [ ] Idiomatic `let`/`const` usage (no `var`)
- [ ] Predictable immutability of input

## Constraints
- [ ] No external libraries
- [ ] Export `updateLeaderboard` from `starter/index.js` for testing
- [ ] `delta` may be negative (penalties)

## Acceptance criteria
- [ ] `{ alice: 10 }` + `[{ playerId: "alice", delta: 5 }]` → `{ alice: 15 }`
- [ ] `{ bob: 3 }` + `[{ playerId: "carol", delta: 7 }]` → `{ bob: 3, carol: 7 }`
- [ ] Input object is unchanged after the call
- [ ] Multiple events for the same player accumulate correctly

## Example data

Input:

```js
updateLeaderboard(
  { p1: 100, p2: 50 },
  [
    { playerId: "p1", delta: -10 },
    { playerId: "p2", delta: 25 },
    { playerId: "p3", delta: 5 },
  ]
)
```

Output:

```js
{ p1: 90, p2: 75, p3: 5 }
```

## Suggested plan (no solution)
1. `const` copy = shallow clone of `initialScores` into a new object.
2. Loop events with `for...of`; `const` each event.
3. `let` or lookup: if player missing, set base `0`, then add `delta`.
4. Return the new object.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Reject events with empty `playerId` by throwing a clear `Error`.
- [ ] Add `getTopPlayer(scores)` returning the id with highest score (ties: lexicographic first).
