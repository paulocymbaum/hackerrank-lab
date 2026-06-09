/**
 * Type Guard
 * node starter/index.js
 */

function describeValue(value) {
  // TODO: null, array, number/NaN, typeof fallback
  return "unknown";
}

function main() {
  const samples = [null, [], NaN, 0, "hi", {}, undefined];
  for (const v of samples) {
    console.log(JSON.stringify(v), "->", describeValue(v));
  }
}

if (require.main === module) {
  main();
}

module.exports = { describeValue };
