/**
 * Boundary Checker
 * node starter/index.js
 */

const readline = require("node:readline");

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
    if (lines.length < 3) return;

    // TODO: parse value/min/max, check inclusive range, print IN RANGE or OUT OF RANGE
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
