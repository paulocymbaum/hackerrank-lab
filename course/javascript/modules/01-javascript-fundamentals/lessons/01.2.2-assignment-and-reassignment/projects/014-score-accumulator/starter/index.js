/**
 * Score Accumulator
 * node starter/index.js
 */

const readline = require("node:readline");

function main() {
  const operatorsArray = ["+", "-", "*"];
  let score = null;
  let finished = false;

  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    if (finished) {
      return;
    }

    if (score === null) {
      score = Number(line);
      if (!Number.isFinite(score)) {
        console.log("ERROR: invalid score");
        finished = true;
        rl.close();
      }
      return;
    }

    if (line === "done") {
      console.log(`Total: ${score}`);
      finished = true;
      rl.close();
      return;
    }

    const operator = line[0];
    const numerator = Number(line.slice(1));

    if (!operatorsArray.includes(operator) || !Number.isFinite(numerator)) {
      console.log("ERROR: invalid operation");
      finished = true;
      rl.close();
      return;
    }

    if (operator === "+") {
      score += numerator;
    } else if (operator === "-") {
      score -= numerator;
    } else if (operator === "*") {
      score *= numerator;
    }
  });
}

main();
