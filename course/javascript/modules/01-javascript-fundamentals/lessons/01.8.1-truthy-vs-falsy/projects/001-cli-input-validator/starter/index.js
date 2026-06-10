/**
 * CLI Input Validator
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("node:readline");

function main() {
  const linhas = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    linhas.push(line);
    if (linhas.length < 3) return;

    // TODO: trim, validar vazio, Number() + Number.isFinite para age/score
    // TODO: normalizar isActive (toLowerCase) e imprimir JSON ou ERROR: ...
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
