/**
 * Validation Doc Block
 * node starter/index.js
 */

const readline = require("node:readline");

function main() {
  const rules = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    // TODO: collect 3 non-empty rules, print comment block or ERROR
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
