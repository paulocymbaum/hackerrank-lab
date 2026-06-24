/**
 * Equality Judge
 *
 * Entrypoint: node starter/index.js
 */

const readline = require("readline");

function judge(a, b) {
  const loose = a == b;
  const strict = a === b;
  const prefer = loose !== strict ? "prefer: ===" : "prefer: either (same result)";
  return ["loose: " + loose, "strict: " + strict, prefer];
}

function runDemo() {
  const pairs = [
    [[], 0],
    [{}, {}],
  ];
  for (const [a, b] of pairs) {
    for (const line of judge(a, b)) {
      process.stdout.write(line + "\n");
    }
    process.stdout.write("---\n");
  }
}

async function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
    if (lines.length === 1 && lines[0].trim() === "demo") {
      runDemo();
      rl.close();
      return;
    }
    if (lines.length < 2) continue;
    const a = JSON.parse(lines[0]);
    const b = JSON.parse(lines[1]);
    for (const out of judge(a, b)) {
      process.stdout.write(out + "\n");
    }
    rl.close();
    return;
  }
  rl.close();
}

main();
