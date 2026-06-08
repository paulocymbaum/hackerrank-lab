<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:01-javascript-fundamentals:examples/07-basic-collections.md -->

# Lesson 07 — Basic collections

**Graph:** `Basic collections` → arrays (`push`, `pop`, `map`, `filter`), objects (`keys`, `values`, `entries`)

## Motivação

Lists and records model real data. Array methods call **your callback** once per item — each call pushes a new frame.

## 1) Stack-first: `map` calls your function per element

**What:** `arr.map(fn)` invokes `fn` synchronously for each index.

**How:**

```js
function double(n) { return n * 2; }
[1, 2].map(double);
```

| Iteration | Stack (top first) |
|-----------|-------------------|
| `double(1)` | `double` → `map` internals → `(module)` |
| `double(2)` | `double` → … |

**Why:** If `double` throws, trace shows `double` above `map`.

### Mental model summary

- `push`/`pop` mutate array end.
- `map`/`filter` return new arrays (idiomatic use).
- `Object.keys` / `values` / `entries` inspect objects.

## Anti-padrões

- Mutating array while iterating with `forEach`/`map` carelessly.
- Assuming `map` runs async (it does not).

## Predict-first

1. How many `double` frames for `[1,2,3].map(double)`?
2. Does `filter` mutate the original?

## Mini exercise

- [ ] `users.map(u => u.name)` — predict stack depth in callback.

## Checklist

- [ ] Use `map` and `filter`
- [ ] Read `Object.entries`
