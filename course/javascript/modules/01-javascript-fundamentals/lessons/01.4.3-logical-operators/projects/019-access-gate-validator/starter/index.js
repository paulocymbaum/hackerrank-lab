/**
 * Access Gate Validator
 * node starter/index.js
 */

const readline = require("node:readline");

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
    if (lines.length < 2) return;

    // TODO: parse age and hasId, print ALLOWED or DENIED
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
