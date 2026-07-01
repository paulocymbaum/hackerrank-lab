# Call Stack

> Graph index: `03.1.3`
<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/03-asynchronous-javascript/03.1.3-call-stack:README.md -->

## Context

The **call stack** is where JavaScript runs synchronous function calls. Each time a function is invoked, a new **stack frame** is pushed; when the function returns, that frame is popped. Only the frame on top can execute — this is why one thread handles one synchronous call chain at a time.

## Predict first

What prints, and in what order?

```js
function second() {
  console.log("second");
}

function first() {
  console.log("first");
  second();
  console.log("after second");
}

console.log("start");
first();
console.log("end");
```

## Explanation

Calling `first()` pushes a frame for `first`. Inside it, `second()` pushes another frame on top. `second` finishes and pops before `after second` runs. Then `first` returns, and finally `end` prints.

```js
function a() {
  console.log("a");
  b();
  console.log("a done");
}

function b() {
  console.log("b");
}

a();
```

Stack at the moment `"b"` prints: `a` (waiting below) → `b` (running on top).

Infinite recursion fills the stack until the engine throws:

```js
function recurse() {
  recurse();
}

recurse(); // RangeError: Maximum call stack size exceeded
```

Scheduled callbacks (`setTimeout`, Promise reactions) do **not** jump onto the stack immediately. The current synchronous work must finish (frames pop) before the event loop can run queued callbacks — linking the call stack to async behavior from earlier lessons.

## What to observe

- Calls **push** frames; returns **pop** them (last in, first out).
- Inner functions must complete before the line after the call in the outer function runs.
- Long-running or infinitely recursive synchronous code keeps the stack busy — nothing else on that thread runs until it finishes or overflows.

## Quick challenge

For the first example, list the call stack top-to-bottom at the exact moment `"second"` prints. Which frames are still waiting underneath?
