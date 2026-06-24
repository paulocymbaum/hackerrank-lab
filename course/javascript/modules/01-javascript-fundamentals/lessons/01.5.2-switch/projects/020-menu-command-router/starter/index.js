/**
 * Menu Command Router
 * node starter/index.js
 */

const readline = require("node:readline");

function main() {
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    // TODO: switch on cmd, print action message
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
