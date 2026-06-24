# Concurrency Limiter

## Problem context
You have many async tasks (e.g. HTTP requests). Running them all at once may overload the server or hit rate limits. You need **bounded concurrency**: only N tasks in flight at a time.

## Goal
Implement a concurrency limiter that schedules promise-returning functions with a maximum number of in-flight operations.

## Functional requirements
- [ ] Implement `createLimiter(limit)` that returns a function `run(taskFn)`.
  - [ ] `limit` is a positive integer.
  - [ ] `taskFn` is `() => Promise<T>`.
- [ ] Behavior:
  - [ ] At most `limit` tasks are running concurrently.
  - [ ] Tasks beyond the limit wait in a queue.
  - [ ] `run(taskFn)` returns a promise that resolves/rejects with the same result as `taskFn`.
- [ ] Provide a demo that schedules at least 10 tasks with `limit = 2` and logs when tasks start/end.

## Non-functional requirements
- [ ] Clear invariants (documented via variable naming and structure)
- [ ] No starvation: tasks should start in FIFO order

## Constraints
- [ ] No external libraries

## Acceptance criteria
- [ ] Concurrency never exceeds the limit (even under rejections).
- [ ] Rejections propagate to the caller of `run(taskFn)`.
- [ ] Queue continues working after a rejection (does not get stuck).

## Example data

```js
const limit = createLimiter(2);

const tasks = Array.from({ length: 5 }, (_, i) => () => new Promise((res) => {
  setTimeout(() => res(i), 50);
}));

const results = await Promise.all(tasks.map(t => limit(t)));
console.log(results); // [0,1,2,3,4]
```

## Suggested plan (no solution)
1. Track `activeCount` and a queue of pending resolvers.
2. When a task finishes, decrement `activeCount` and start the next queued task.
3. Ensure the “start next” step runs in `finally` so failures don’t freeze the queue.

## Deliverables
- [ ] Code in `starter/`
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `onStart/onFinish` hooks for instrumentation.
- [ ] Add cancellation support using `AbortController`.
