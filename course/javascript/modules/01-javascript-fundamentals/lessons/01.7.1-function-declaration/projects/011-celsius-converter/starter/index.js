/**
 * Celsius Converter
 * node starter/index.js
 */

const readline = require("node:readline");

function toFahrenheit(celsius) {
  // TODO: return converted value
  return 0;
}

function main() {
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    // TODO: parse, call toFahrenheit, print F: X.X
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

if (require.main === module) {
  main();
}

module.exports = { toFahrenheit };
