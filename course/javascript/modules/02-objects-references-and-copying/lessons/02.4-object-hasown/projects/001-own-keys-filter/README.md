# Own Keys Filter

## Problem context
When processing user records, you often need to serialize **only fields defined on the object**, not inherited prototype properties like `toString`.

This project trains `Object.hasOwn` to filter enumerable own keys safely.

## Goal
## Lesson concepts practiced
- [ ] const record = { id: 1 };
- [ ] console.log(Object.hasOwn(record, "toString")); // false
- [ ] console.log("toString" in record);               // true (from Object.prototype)

Implement `ownKeys(obj)` that returns an array of **own enumerable string keys** sorted alphabetically, ignoring inherited properties.

## Functional requirements
- [ ] Implement `ownKeys(obj)`.
- [ ] Include only keys where `Object.hasOwn(obj, key)` is true.
- [ ] Include only enumerable own keys (use `Object.keys` semantics combined with `hasOwn`, or equivalent).
- [ ] Return keys sorted in ascending lexicographic order.
- [ ] CLI: read one JSON object from `stdin`, print JSON array of own keys to `stdout`.
- [ ] If input is not a plain object, print `ERROR: <message>`.

## Non-functional requirements
- [ ] Readability and maintainability
- [ ] Do not mutate the input object
- [ ] Deterministic output for the same input

## Constraints
- [ ] Node.js only (no external dependencies)
- [ ] Use `Object.hasOwn` (not legacy `hasOwnProperty` on the object directly)
- [ ] Reject `null`, arrays, and primitives with a clear error

## Acceptance criteria
- [ ] `{}` → `[]`
- [ ] `{ b: 1, a: 2 }` → `["a", "b"]`
- [ ] Object with prototype properties does not list inherited keys
- [ ] Input object unchanged after the call

## Example data

Input:

```json
{"name":"Ana","score":10}
```

Output:

```json
["name","score"]
```

Prototype case:

```js
const base = { inherited: true };
const obj = Object.create(base);
obj.id = 1;
// ownKeys(obj) => ["id"]
```

## Suggested plan (no solution)
1. Validate input is a non-null, non-array object.
2. Collect candidate keys (e.g. `Object.keys(obj)` or `for...in` with `hasOwn` guard).
3. Filter with `Object.hasOwn(obj, key)`.
4. Sort and return.
5. Wire CLI to parse stdin and print JSON array.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `ownEntries(obj)` returning `[key, value]` pairs for own keys only
- [ ] Support a `--values` flag that outputs own key/value object
