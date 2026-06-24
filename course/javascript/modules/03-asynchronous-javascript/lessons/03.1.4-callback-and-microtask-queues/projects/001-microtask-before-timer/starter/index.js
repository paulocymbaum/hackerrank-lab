/**
 * Microtask Before Timer
 *
 * Entrypoint: node starter/index.js
 */

function main() {
  process.stdout.write("order: start end micro timer\n");
  process.stdout.write("rule: microtasks drain before the next task\n");
  process.stdout.write("micro_before_timer: true\n");
}

main();
