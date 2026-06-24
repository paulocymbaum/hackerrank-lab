<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/02-objects-references-and-copying/02.4-object-hasown:README.md -->

# Object.hasOwn — Own Properties vs Inherited

## Context
Objects can have properties on themselves **and** on their prototype chain. The `in` operator returns `true` for inherited properties; sometimes you only care about **own** properties.

## Predict first

What prints?

```js
const base = { shared: true };
const user = Object.create(base);
user.name = "Ana";

console.log("name" in user);
console.log("shared" in user);
console.log(Object.hasOwn(user, "name"));
console.log(Object.hasOwn(user, "shared"));
```

### What to observe
- `"name" in user` is `true` (own property).
- `"shared" in user` is `true` (inherited from prototype).
- `Object.hasOwn(user, "name")` is `true`.
- `Object.hasOwn(user, "shared")` is `false` — prototype properties are not "own".

## Explanation

| Check | Own property | Inherited property |
|-------|--------------|-------------------|
| `"key" in obj` | yes | yes |
| `Object.hasOwn(obj, "key")` | yes | no |
| `obj.hasOwnProperty("key")` | yes | no (avoid on objects that may override it) |

`Object.hasOwn(obj, key)` is the modern, safe way to ask: **does this object itself define this key?**

Common use cases:
- Iterating keys you defined on an instance (ignore prototype noise).
- Distinguishing `"toString" in obj` (often inherited) from data fields you added.
- Building serializers that should not treat inherited methods as data fields.

## What to observe

```js
const record = { id: 1 };
console.log(Object.hasOwn(record, "toString")); // false
console.log("toString" in record);               // true (from Object.prototype)
```

## Quick challenge
Given:

```js
const config = Object.create({ theme: "dark" });
config.lang = "en";
config.theme = "light";
```

List which keys are **own** vs **inherited**. Which value wins for `config.theme` when you read it?
