/**
 * Snapshot Cloner
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

function cloneForSafety(value) {
  // TODO: structuredClone when available, else JSON fallback with clear errors
  throw new Error("Not implemented");
}

async function main() {
  const raw = (await readStdin()).trim();
  if (raw.length === 0) return fail("missing input");

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return fail("invalid JSON");
  }

  const before = JSON.stringify(input);

  let cloned;
  try {
    cloned = cloneForSafety(input);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "clone failed");
  }

  if (JSON.stringify(input) !== before) {
    return fail("input was mutated");
  }

  process.stdout.write(`${JSON.stringify(cloned)}\n`);
}

main();
