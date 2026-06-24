/**
 * Sync Trace
 *
 * Entrypoint: node starter/index.js
 */

const readline = require("readline");

const SNIPPETS = {
  basic: "A C",
  nested: "1 4",
  chain: "start middle end",
};

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const id = line.trim();
    const order = SNIPPETS[id];
    if (!order) {
      process.stdout.write("ERROR: unknown snippet\n");
    } else {
      process.stdout.write("Sync order: " + order + "\n");
    }
    break;
  }
  rl.close();
}

main();
