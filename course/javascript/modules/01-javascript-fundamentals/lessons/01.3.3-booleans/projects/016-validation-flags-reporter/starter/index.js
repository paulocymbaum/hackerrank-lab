/**
 * Validation Flags Reporter
 * node starter/index.js
 */

const readline = require("node:readline");

function main() {
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    // TODO: parse score, compute passed/perfect/invalid flags, print lines
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
