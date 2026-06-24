# JavaScript Fundamentals

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals -->

This module focuses on one of the most common sources of subtle JavaScript bugs: **truthiness** and **type coercion**, especially around **`==` vs `===`**.

## Motivation

If you read input from the CLI, a file, an API, a form, or HackerRank’s `stdin`, you are almost always dealing with **strings**. Many bugs come from JavaScript quietly converting values for you.

Typical real-world failures:
- A “missing” field is `null` in one API and `undefined` in another.
- A boolean check treats `0` as “missing” even when `0` is a valid value.
- A comparison passes unexpectedly because `==` coerced types.
- Validation code rejects correct input like `"0"`.

If you can predict coercion, you can prevent it.

## Definitions and terms

### Primitive vs object
- **Primitives**: `string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, `null`.
- **Objects**: everything else, including `{}`, `[]`, functions, dates, regex.

### Truthy vs falsy
In a boolean context (like `if (...)`), values are converted using *ToBoolean*.

**Falsy values** (only these):
- `false`
- `0`, `-0`, `0n`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

Everything else is **truthy** (including `"0"`, `[]`, `{}`).

### Equality operators
- `===` (**strict equality**): compares **type + value**, no coercion.
- `==` (**loose equality**): may coerce types before comparing.

Rule of thumb: **use `===` by default**.

### A few coercion “mental rules”
You don’t need the entire spec, but you do need a few predictable patterns:

- In numeric comparisons / math, strings often become numbers:
  - `Number("0")` → `0`
  - `"0" == 0` → `true`
- In boolean contexts, use the falsy list; objects are always truthy:
  - `Boolean([])` → `true`
- `null` and `undefined` have a special case in `==`:
  - `null == undefined` → `true`
  - but `null == 0` → `false`

## Common pitfalls (and how to avoid)

### 1) `typeof null`

```js
typeof null // "object" (legacy quirk)
```

**Avoid** `typeof x === 'null'` (it will never work).

**Do**:
- `x === null` (only null)
- `x == null` (null or undefined)

### 2) Checking arrays/objects with `if (value)`

```js
if ([]) {
  // runs (arrays are truthy)
}
```

**Do**:
- For “is array empty”: `arr.length === 0`
- For “maybe missing”: `arr == null` or optional chaining `arr?.length`

### 3) `0` is falsy, but often valid

```js
// BUG if 0 is a valid input:
if (!age) { /* treat as missing */ }
```

**Do**:
- If you mean “missing”: `age == null` (nullish)
- If you mean “empty string”: `age === ""`
- If you mean “not a finite number”: `Number.isFinite(age)`

### 4) `NaN` is not equal to itself

```js
NaN === NaN // false
```

**Do**:
- `Number.isNaN(x)` (preferred)

### 5) Surprising `==` cases
These are famous for interviews because they hurt in production:

```js
"" == 0        // true
"0" == 0       // true
[] == 0        // true
[] == false    // true
[1] == 1       // true
{} == {}       // false (different references)
```

**Why it matters**: if you rely on `==`, you are relying on coercion rules you probably didn’t intend.

## Best practices and trade-offs

### Prefer `===`
Use strict equality unless you have a very specific reason not to.

### Use `== null` intentionally
This is one of the rare acceptable uses of `==`:

```js
if (value == null) {
  // true when value is null OR undefined
}
```

It’s concise and readable when you truly mean “nullish”.

### Convert explicitly
When you want a number, make it a number:

```js
const n = Number(input);
if (!Number.isFinite(n)) throw new Error('Invalid number');
```

When you want a boolean, convert deliberately:

```js
const isEnabled = Boolean(flag);
```

### `||` vs `??`
- `||` uses truthiness: it treats `0`, `""`, `false` as “missing”.
- `??` uses nullish: it treats only `null`/`undefined` as “missing”.

```js
const x = 0;
(x || 10)  // 10
(x ?? 10)  // 0
```

### Optional chaining `?.`
Use it to avoid crashes when a value may be nullish:

```js
user?.address?.zip
arr?.length
```

## Checklist (what you should master)

- [ ] List all **falsy** values (and know everything else is truthy)
- [ ] Know when `===` differs from `==` and why
- [ ] Use `value == null` for “null or undefined” checks (only when you mean it)
- [ ] Avoid treating `0`/`""`/`false` as “missing” unless that’s intended
- [ ] Validate numeric parsing using `Number()` + `Number.isFinite`
- [ ] Handle optional fields with `??` and `?.`

## Quick self-test (predict the output)

1)
```js
console.log(typeof null);
```

2)
```js
console.log(Boolean("0"));
console.log(Boolean(0));
```

3)
```js
console.log(null == undefined);
console.log(null === undefined);
```

4)
```js
console.log([] == false);
console.log(Boolean([]));
```

5)
```js
const x = 0;
console.log(x || 99);
console.log(x ?? 99);
```
