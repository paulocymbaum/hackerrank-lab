/**
 * Missing Value Labeler
 * node starter/index.js
 */

const readline = require("node:readline");

function main() {
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    // TODO: trim token, label as missing / empty / has-value
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
