const { bfs } = require("../../../scripts/graph/utils/bfs");
const {
  loadGraph,
  extractIndexPath,
  normalizeIndexPath,
  indexPathsEqual,
} = require("./_loadGraph");

function usage() {
  return [
    "Usage: node .cursor/tools/graph/find-node-by-index.js <indexPath>",
    "Examples:",
    '  node .cursor/tools/graph/find-node-by-index.js "01"',
    '  node .cursor/tools/graph/find-node-by-index.js "01.2.1"',
    '  node .cursor/tools/graph/find-node-by-index.js "3.2.1"',
  ].join("\n");
}

function main() {
  const indexRaw = process.argv[2];
  if (!indexRaw) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const targetIndex = normalizeIndexPath(indexRaw);
  if (!targetIndex) {
    process.stderr.write(`INVALID_INDEX: ${indexRaw}\n`);
    process.exit(2);
  }

  const graph = loadGraph();
  let found = null;

  bfs(graph, graph.rootId, {
    visit: (node) => {
      if (found) return;
      const nodeIndex = extractIndexPath(node.label);
      if (nodeIndex && indexPathsEqual(nodeIndex, targetIndex)) found = node;
    },
  });

  if (!found) {
    process.stdout.write(`NOT_FOUND: ${targetIndex}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(
    JSON.stringify(
      {
        index: targetIndex,
        node: found,
      },
      null,
      2
    ) + "\n"
  );
}

if (require.main === module) main();
