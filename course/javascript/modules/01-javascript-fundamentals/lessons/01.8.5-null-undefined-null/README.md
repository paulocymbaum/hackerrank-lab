<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/03-null-undefined-and-operators.md -->

# `null`, `undefined`, and Operators (`== null`, `?.`, `??`)

## Context
`null` and `undefined` often represent “missing”, but they behave differently.

## The intentional `== null` pattern

```js
if (value == null) {
  // true only when value is null OR undefined
}

console.log(null == undefined);   // true
console.log(null === undefined);  // false
```

## Optional chaining `?.`
Use it to avoid crashes when a value may be nullish:

```js
console.log(user?.address?.zip);
console.log(arr?.length);
```

- If the left side is `null`/`undefined`, the expression becomes `undefined`.

## `||` vs `??`
- `||` uses truthiness (treats `0`, `""`, `false` as missing).
- `??` uses nullish (treats only `null`/`undefined` as missing).

```js
const x = 0;
console.log(x || 10); // 10
console.log(x ?? 10); // 0
```

## Mini-exercise
When do you want `||` (truthy) and when do you want `??` (nullish)?
Write one real example of each.
