# Nested State Updater

## Problem context
UI state in JavaScript is often nested: `{ items: [{ id, qty }] }`. A common bug is to shallow-copy the outer object and still mutate the original because inner arrays/objects are shared.

This project trains **copy-on-write**: update nested data without mutating the input state.

## Goal
## Lesson concepts practiced
- [ ] `copy` is a new top-level object; `copy.address` still references `user.address`.
- [ ] To update nested data safely, copy every level you touch (copy-on-write).

Implement `incrementItemQty(state, itemId)` that returns a **new** state object with the matching item's `qty` incremented by 1, leaving `state` unchanged.

## Functional requirements
- [ ] Implement `incrementItemQty(state, itemId)` exported from `starter/index.js` (or defined there for the CLI).
- [ ] Input `state` shape: `{ items: Array<{ id: number, qty: number }> }`.
- [ ] Find the item where `item.id === itemId` and increment its `qty` by 1.
- [ ] If no item matches `itemId`, return a deep-enough copy with no quantity changes (still must not mutate input).
- [ ] Do **not** mutate `state`, `state.items`, or any item object inside `state`.
- [ ] CLI: read one JSON line from `stdin` shaped as `{ "state": {...}, "itemId": number }`, print one JSON line `{ "nextState": {...} }`.

## Non-functional requirements
- [ ] Readability and maintainability
- [ ] Error handling for invalid input
- [ ] Use spread/copy-on-write at each nested level you change

## Constraints
- [ ] Node.js only (no external dependencies)
- [ ] Do not mutate the parsed input objects
- [ ] Do not use `structuredClone` (practice manual copy-on-write)

## Acceptance criteria
- [ ] After calling `incrementItemQty(state, 1)`, `state.items[0].qty` is unchanged
- [ ] Returned `nextState.items` is a new array reference
- [ ] Updated item object is a new object reference
- [ ] Unchanged items keep the same `qty` values in the output

## Example data

Input (stdin):

```json
{"state":{"items":[{"id":1,"qty":1},{"id":2,"qty":5}]},"itemId":1}
```

Output (stdout):

```json
{"nextState":{"items":[{"id":1,"qty":2},{"id":2,"qty":5}]}}
```

Verify immutability:

```js
const state = { items: [{ id: 1, qty: 1 }] };
const next = incrementItemQty(state, 1);
// state.items[0].qty === 1
// next.items[0].qty === 2
// state.items !== next.items
```

## Suggested plan (no solution)
1. Map over `state.items` to build a new array.
2. For the matching `id`, return a **new item object** with `qty + 1`.
3. For non-matching items, you may reuse the same item reference (optional) or copy for clarity.
4. Return `{ items: newItems }` without mutating `state`.
5. Wire the CLI to parse stdin, call the function, and print JSON.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support incrementing by a custom delta passed in the CLI payload
- [ ] Add a test that shallow copy `{ ...state }` would fail the immutability check
