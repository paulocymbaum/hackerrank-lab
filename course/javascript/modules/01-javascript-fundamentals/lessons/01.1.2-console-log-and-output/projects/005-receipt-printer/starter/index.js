/**
 * Receipt Printer
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("node:readline");

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
    if (lines.length < 3) return;

    // TODO: validate fields and print receipt or ERROR
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
