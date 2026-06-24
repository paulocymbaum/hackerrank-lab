const { dfs } = require("../../../scripts/graph/utils/dfs");
const { loadGraph, labelsMatch } = require("./_loadGraph");

function usage() {
  return [
    "Usage: node .cursor/tools/graph/find-topic-dfs.js <label>",
    'Example: node .cursor/tools/graph/find-topic-dfs.js "Promises"',
  ].join("\n");
}

function main() {
  const targetRaw = process.argv[2];
  if (!targetRaw) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const graph = loadGraph();

  let found = null;
  dfs(graph, graph.rootId, {
    visit: (node) => {
      if (!found && labelsMatch(node.label, targetRaw)) found = node;
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

