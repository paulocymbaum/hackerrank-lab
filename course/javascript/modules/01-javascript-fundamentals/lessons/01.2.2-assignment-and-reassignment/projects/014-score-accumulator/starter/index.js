/**
 * Score Accumulator
 * node starter/index.js
 */

const readline = require("node:readline");

function main() {
  let score = null;
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    // TODO: parse initial score, apply += -= *= operations until done
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
