const { loadGraph, findTopic } = require("./_loadGraph");

function usage() {
  return [
    "Usage: node .cursor/tools/graph/find-topic-bfs.js <label>",
    "Matches exact labels first, then case-insensitive substring.",
    'Example: node .cursor/tools/graph/find-topic-bfs.js "Fundamentals"',
  ].join("\n");
}

function main() {
  const targetRaw = process.argv[2];
  if (!targetRaw) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const graph = loadGraph();
  const result = findTopic(graph, targetRaw, { order: "bfs" });

  if (!result) {
    process.stdout.write(`NOT_FOUND: ${targetRaw}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

if (require.main === module) main();
