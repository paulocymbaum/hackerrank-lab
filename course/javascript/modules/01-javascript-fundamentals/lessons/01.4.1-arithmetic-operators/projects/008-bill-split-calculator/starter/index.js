/**
 * Expression Evaluator
 *
 * Entrypoint: node starter/index.js
 */

const readline = require("readline");

function isNumericPair(a, b) {
  return Number.isFinite(Number(a)) && Number.isFinite(Number(b));
}

function applyOp(a, op, b) {
  if (op === "+") {
    if (isNumericPair(a, b)) return Number(a) + Number(b);
    return String(a) + String(b);
  }
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return { error: "invalid number" };
  if (op === "-") return x - y;
  if (op === "*") return x * y;
  if (op === "/") {
    if (y === 0) return { error: "division by zero" };
    return x / y;
  }
  if (op === "%") return x % y;
  if (op === "**") return x ** y;
  return { error: "invalid operator" };
}

function evalPrecedence(expr) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return { error: "invalid expression" };
  const [a, op1, b, op2, c] = parts;
  if (op2 === "*") {
    const mid = applyOp(b, op2, c);
    if (mid && mid.error) return mid;
    return applyOp(a, op1, String(mid));
  }
  return { error: "unsupported expression" };
}

async function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
  }
  rl.close();

  if (lines.length === 1 && lines[0].includes("*")) {
    const result = evalPrecedence(lines[0]);
    if (result && result.error) {
      process.stdout.write("ERROR: " + result.error + "\n");
      return;
    }
    process.stdout.write("Result: " + result + "\n");
    return;
  }

  if (lines.length < 3) {
    process.stdout.write("ERROR: invalid input\n");
    return;
  }

  const a = lines[0].trim();
  const op = lines[1].trim();
  const b = lines[2].trim();
  const result = applyOp(a, op, b);
  if (result && result.error) {
    process.stdout.write("ERROR: " + result.error + "\n");
    return;
  }
  process.stdout.write("Result: " + result + "\n");
}

main();
