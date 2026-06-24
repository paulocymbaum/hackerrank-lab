/**
 * Promise Chain Builder
 *
 * Entrypoint: node starter/index.js
 */

const readline = require("readline");

function fakeRead(path, callback) {
  setTimeout(() => {
    if (path === "fail") {
      callback(new Error("not found"));
      return;
    }
    callback(null, "data:" + path);
  }, 0);
}

function readAsPromise(path) {
  return new Promise((resolve, reject) => {
    fakeRead(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function runPipeline(path) {
  return readAsPromise(path)
    .then((data) => data + " -> parsed")
    .then((data) => data + " -> done")
    .catch((err) => "ERROR: " + err.message);
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const path = line.trim();
    const result = await runPipeline(path);
    process.stdout.write(result + "\n");
    break;
  }
  rl.close();
}

main();
