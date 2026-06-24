/**
 * Output Order Predictor
 *
 * Entrypoint: node starter/index.js
 */

const SNIPPETS = [
  {
    name: "basic",
    order: "A B micro timer",
    classifications: [
      "A:sync",
      "B:sync",
      "micro:microtask",
      "timer:task",
    ],
    explanation:
      "Sync logs run on the call stack first. Promise reactions are microtasks and drain before the setTimeout task runs.",
  },
  {
    name: "async-await",
    order: "A C B",
    classifications: ["A:sync", "C:sync", "B:microtask"],
    explanation:
      "main() runs until await, which schedules the rest as a microtask. C prints before B resumes.",
  },
  {
    name: "chained-microtasks",
    order: "m1 m2 t1",
    classifications: ["m1:microtask", "m2:microtask", "t1:task"],
    explanation:
      "Microtasks m1 and m2 drain completely before task t1 from setTimeout.",
  },
  {
    name: "trick",
    order: "start end micro timer",
    classifications: [
      "start:sync",
      "end:sync",
      "micro:microtask",
      "timer:task",
    ],
    explanation:
      "Microtasks always run before the next task, so micro prints before timer even with setTimeout(0).",
  },
];

function formatSnippet(snippet) {
  const lines = [
    `=== ${snippet.name} ===`,
    `order: ${snippet.order}`,
    ...snippet.classifications.map((c) => `  ${c}`),
    `explanation: ${snippet.explanation}`,
  ];
  return lines.join("\n");
}

function main() {
  for (const snippet of SNIPPETS) {
    process.stdout.write(formatSnippet(snippet) + "\n\n");
  }
}

main();
