# Objects, References, and Copying
<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:02-objects-references-and-copying:README.md -->

This module is a **3-tier lesson** about one of the most common sources of JavaScript bugs: **reference semantics**.

If you don’t know when values are **copied** vs **shared**, you’ll accidentally mutate data, introduce spooky action at a distance, and later struggle with async code (where “when” something changes matters).

## Tier 1 — Beginner: Values vs references (predict-first)

### The rule of thumb
- **Primitives** (`string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, `null`) behave like **values**.
- **Objects** (plain objects, arrays, functions, dates, maps, etc.) behave like **references**.

### Predict-first snippet
What prints?

```js
let a = 10;
let b = a;
b = 20;
console.log(a, b);
```

Now this one:

```js
const a = { n: 10 };
const b = a;
b.n = 20;
console.log(a.n, b.n);
```

### Key terms
- **Mutation**: changing an existing object/array (`obj.x = ...`, `arr.push(...)`).
- **Alias**: two variables pointing to the same object.

### Beginner checklist
- [ ] I can tell if a value is primitive vs object.
- [ ] I can predict when two variables alias the same object.
- [ ] I can explain why `const` does **not** make an object immutable.

## Tier 2 — Intermediate: Shallow copy (and the nested trap)

### Shallow copy in practice
Common shallow copy tools:
- Objects: `{ ...obj }`, `Object.assign({}, obj)`
- Arrays: `[...arr]`, `arr.slice()`, `Array.from(arr)`

Shallow copy means:
- the **top-level container** is new
- **nested objects/arrays are still shared**

### Predict-first snippet
What prints?

```js
const user = { name: "Ana", address: { city: "SP" } };
const copy = { ...user };
copy.address.city = "RJ";
console.log(user.address.city);
```

### Why this matters
Many real bugs are “I copied it… why did the original change?”

### Safer patterns
- Prefer **copy-on-write**: only copy the parts you change.
- When updating nested state, copy each level you touch:

```js
const next = {
  ...user,
  address: {
    ...user.address,
    city: "RJ",
  },
};
```

### Intermediate checklist
- [ ] I know what shallow copy guarantees (and what it doesn’t).
- [ ] I can update nested data without mutating the original.
- [ ] I can spot mutations (`push`, `pop`, `splice`, `sort`, `reverse`, property assignment).

## Tier 3 — Advanced: Deep copy, `structuredClone`, and trade-offs

### Deep copy options (not all are equal)
- **`structuredClone(value)`**: best default when available (Node 17+ / modern runtimes).
  - supports many built-in types and handles cycles (unlike JSON).
- **`JSON.parse(JSON.stringify(value))`**: only for JSON-safe data.
  - loses `undefined`, functions, `Date`, `Map`, `Set`, `BigInt`, and breaks on cycles.

### Predict-first snippet
What happens?

```js
const x = { when: new Date(), n: 1 };
const y = JSON.parse(JSON.stringify(x));
console.log(typeof y.when, y.when);
```

### Important trade-off
Deep copy is not “always better”:
- it can be expensive (CPU + memory)
- it can hide design issues (unclear ownership of data)

Prefer to design **clear ownership**:
- who is allowed to mutate?
- when is data treated as immutable snapshots?

### Advanced checklist
- [ ] I know when to use `structuredClone` vs shallow copy.
- [ ] I can explain why JSON cloning is lossy.
- [ ] I can justify a copying strategy based on data size and invariants.

## Common pitfalls (quick list)
- Thinking `const` prevents mutation.
- Using `Array.prototype.sort()` on a shared array (it mutates).
- Copying only the top-level object and then mutating nested fields.
- Using JSON cloning without realizing it changes types.

## Self-test (Tiered)

### Tier 1
Predict:

```js
const a = [1, 2];
const b = a;
b.push(3);
console.log(a.length);
```

### Tier 2
Predict:

```js
const a = [{ x: 1 }];
const b = [...a];
b[0].x = 99;
console.log(a[0].x);
```

### Tier 3
Predict:

```js
const a = { n: 1n };
try {
  JSON.stringify(a);
  console.log("ok");
} catch (e) {
  console.log("error");
}
```
