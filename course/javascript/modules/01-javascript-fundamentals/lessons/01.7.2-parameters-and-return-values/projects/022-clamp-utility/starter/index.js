/**
 * Clamp Utility
 * node starter/index.js
 */

const readline = require("node:readline");

function clamp(value, min, max) {
  // TODO: return min, max, or value with early returns
  return value;
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
    if (lines.length < 3) return;

    // TODO: parse value/min/max, call clamp, print Result: X
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
