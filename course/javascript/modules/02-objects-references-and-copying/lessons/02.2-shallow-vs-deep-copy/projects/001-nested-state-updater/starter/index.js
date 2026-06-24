/**
 * Nested State Updater
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

function fail(message) {
  process.stdout.write(`ERROR: ${message}\n`);
}

function incrementItemQty(state, itemId) {
  // TODO: copy-on-write — do not mutate state or nested objects
  throw new Error("Not implemented");
}

async function main() {
  const raw = (await readStdin()).trim();
  if (raw.length === 0) return fail("missing input");

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return fail("invalid JSON");
  }

  if (payload == null || typeof payload !== "object" || Array.isArray(payload)) {
    return fail("payload must be a JSON object");
  }

  const { state, itemId } = payload;
  if (state == null || typeof state !== "object" || Array.isArray(state)) {
    return fail("state must be an object");
  }
  if (typeof itemId !== "number" || !Number.isInteger(itemId)) {
    return fail("itemId must be an integer");
  }

  const before = JSON.stringify(state);

  let nextState;
  try {
    nextState = incrementItemQty(state, itemId);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "clone failed");
  }

  if (JSON.stringify(state) !== before) {
    return fail("state was mutated");
  }

  process.stdout.write(`${JSON.stringify({ nextState })}\n`);
}

main();
