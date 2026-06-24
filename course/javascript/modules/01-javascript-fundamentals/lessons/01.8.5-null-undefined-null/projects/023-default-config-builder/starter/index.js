/**
 * Default Config Builder
 * node starter/index.js
 */

const readline = require("node:readline");

function parseField(line) {
  const trimmed = line.trim();
  if (trimmed === "") return undefined;
  if (trimmed === "null") return null;
  return line;
}

function buildConfig(raw) {
  // TODO: apply ?? and || rules, return { retries, timeout, label, active }
  return {};
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
    if (lines.length < 4) return;

    // TODO: buildConfig, print four labeled lines or ERROR
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
