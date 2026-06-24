/**
 * Alias Tracker
 *
 * Entrypoint: node starter/index.js
 */

function main() {
  const original = { n: 1 };
  let b = original;
  process.stdout.write("step 1: original.n=1 unchanged (binding)\n");

  b.n = 2;
  process.stdout.write("step 2: original.n=2 changed (mutation)\n");

  b = { n: 99 };
  process.stdout.write("step 3: original.n=2 unchanged (reassignment)\n");

  original.n = 5;
  process.stdout.write("step 4: original.n=5 changed (mutation)\n");

  process.stdout.write("final: original.n=" + original.n + " b.n=" + b.n + "\n");
}

main();
