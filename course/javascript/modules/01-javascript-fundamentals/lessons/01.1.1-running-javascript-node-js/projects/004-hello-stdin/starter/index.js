/**
 * Hello Stdin
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("node:readline");

function main() {
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    // TODO: trim, validate, and print greeting or error
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
