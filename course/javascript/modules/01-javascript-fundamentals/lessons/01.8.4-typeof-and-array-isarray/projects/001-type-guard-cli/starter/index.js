/**
 * Type Guard CLI
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

function classifyValue(value) {
  // TODO: null → "null", arrays → "array", else typeof
  throw new Error("Not implemented");
}

async function main() {
  const raw = (await readStdin()).trim();
  if (raw.length === 0) return fail("invalid JSON");

  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return fail("invalid JSON");
  }

  let label;
  try {
    label = classifyValue(value);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "failed");
  }

  process.stdout.write(`${label}\n`);
}

main();
