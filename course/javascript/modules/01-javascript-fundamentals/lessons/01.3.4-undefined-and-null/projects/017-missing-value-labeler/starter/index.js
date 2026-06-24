/**
 * Optional Field Describer
 *
 * Entrypoint: node starter/index.js
 */

const readline = require("readline");

function describeField(value) {
  if (value === undefined) return "not provided";
  if (value === null) return "explicitly empty";
  return "has value: " + String(value);
}

function parseLine(line) {
  const trimmed = line.trim();
  if (trimmed === "undefined") return undefined;
  return JSON.parse(trimmed);
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    if (line.trim() === "done") break;
    try {
      const value = parseLine(line);
      process.stdout.write(describeField(value) + "\n");
    } catch {
      process.stdout.write("ERROR: invalid input\n");
    }
  }
  rl.close();
}

main();
