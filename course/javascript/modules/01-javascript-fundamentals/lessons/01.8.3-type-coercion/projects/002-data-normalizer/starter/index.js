/**
 * Coercion Predictor
 *
 * Entrypoint: node starter/index.js
 */

const readline = require("readline");

const RULES = new Map([
  ['""|==|0', "empty string coerces to 0 with =="],
  ["[]|==|0", "array coerces to 0 with =="],
  ["null|==|undefined", "null and undefined are equal with =="],
  ["null|===|undefined", "null and undefined are different types with ==="],
]);

function ruleFor(a, op, b) {
  const key = JSON.stringify(a) + "|" + op + "|" + JSON.stringify(b);
  if (RULES.has(key)) return RULES.get(key);
  if (op === "===") return "no coercion with ===";
  return "== may coerce types before comparing";
}

function compare(a, op, b) {
  if (op === "==") return a == b;
  if (op === "===") return a === b;
  return null;
}

async function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
    if (lines.length < 3) continue;
    const a = JSON.parse(lines[0]);
    const op = lines[1].trim();
    const b = JSON.parse(lines[2]);
    if (op !== "==" && op !== "===") {
      process.stdout.write("ERROR: invalid operator\n");
      rl.close();
      return;
    }
    const result = compare(a, op, b);
    process.stdout.write("result: " + result + "\n");
    process.stdout.write("rule: " + ruleFor(a, op, b) + "\n");
    rl.close();
    return;
  }
  rl.close();
}

main();
