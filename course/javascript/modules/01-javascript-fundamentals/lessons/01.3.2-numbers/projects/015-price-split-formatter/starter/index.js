/**
 * Price Split Formatter
 * node starter/index.js
 */

const readline = require("node:readline");

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
    if (lines.length < 2) return;

    // TODO: parse total and people, print Share: $X.XX or ERROR
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
