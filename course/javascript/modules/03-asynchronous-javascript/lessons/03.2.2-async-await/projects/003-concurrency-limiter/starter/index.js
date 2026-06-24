/**
 * Sequential Async Runner
 *
 * Entrypoint: node starter/index.js
 */

const readline = require("readline");

function delay(ms, label) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(label), ms);
  });
}

async function stepFetch() {
  return delay(10, "fetch:ok");
}

async function stepTransform() {
  return delay(10, "transform:ok");
}

async function stepSave(shouldFail) {
  if (shouldFail) {
    throw new Error("save failed");
  }
  return delay(10, "save:ok");
}

async function runPipeline(shouldFail) {
  try {
    const a = await stepFetch();
    const b = await stepTransform();
    const c = await stepSave(shouldFail);
    return [a, b, c].join(" | ");
  } catch (err) {
    return "ERROR: " + err.message;
  }
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const mode = line.trim();
    const shouldFail = mode === "fail";
    const result = await runPipeline(shouldFail);
    process.stdout.write(result + "\n");
    break;
  }
  rl.close();
}

main();
