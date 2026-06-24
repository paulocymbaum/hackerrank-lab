/**
 * Commented Validator
 *
 * Entrypoint: node starter/index.js
 */

const readline = require("readline");

function validate(name, score) {
  const trimmed = name.trim();

  // Rule 1: name must not be empty after trim
  if (trimmed.length === 0) {
    return "ERROR: name is required";
  }

  // Rule 2: score must be 0–100
  // if (!Number.isInteger(score) || score < 0 || score > 100) {
  //   return "ERROR: score out of range";
  // }

  // Rule 3: name must be at least 2 chars after trim
  if (trimmed.length < 2) {
    return "ERROR: name too short";
  }

  return "OK";
}

async function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
    if (lines.length < 2) continue;
    const name = lines[0];
    const score = Number(lines[1].trim());
    process.stdout.write(validate(name, score) + "\n");
    rl.close();
    return;
  }
  rl.close();
}

main();
