const { bfs } = require("../../../scripts/graph/utils/bfs");
const { loadGraph, normalize } = require("./_loadGraph");

function usage() {
  return [
    "Usage: node .cursor/tools/graph/find-topic-bfs.js <label>",
    'Example: node .cursor/tools/graph/find-topic-bfs.js "Closures"',
  ].join("\n");
}

function main() {
  const targetRaw = process.argv[2];
  if (!targetRaw) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const target = normalize(targetRaw);
  const graph = loadGraph();

  let found = null;
  bfs(graph, graph.rootId, {
    visit: (node) => {
      if (!found && normalize(node.label) === target) found = node;
    },
  });

  if (!found) {
    process.stdout.write(`NOT_FOUND: ${targetRaw}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(JSON.stringify(found, null, 2) + "\n");
}

if (require.main === module) main();

