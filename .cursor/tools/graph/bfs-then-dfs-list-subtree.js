const { bfs } = require("../../../scripts/graph/utils/bfs");
const { dfs } = require("../../../scripts/graph/utils/dfs");
const { loadGraph, normalize } = require("./_loadGraph");

function usage() {
  return [
    "Usage: node .cursor/tools/graph/bfs-then-dfs-list-subtree.js <sectionLabel>",
    'Example: node .cursor/tools/graph/bfs-then-dfs-list-subtree.js "Asynchronous JavaScript"',
  ].join("\n");
}

function main() {
  const sectionRaw = process.argv[2];
  if (!sectionRaw) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const section = normalize(sectionRaw);
  const graph = loadGraph();

  let sectionNode = null;
  bfs(graph, graph.rootId, {
    visit: (node) => {
      if (!sectionNode && normalize(node.label) === section) sectionNode = node;
    },
  });

  if (!sectionNode) {
    process.stdout.write(`SECTION_NOT_FOUND: ${sectionRaw}\n`);
    process.exitCode = 1;
    return;
  }

  const labels = [];
  dfs(graph, sectionNode.id, {
    visit: (node) => labels.push(node.label),
  });

  process.stdout.write(
    JSON.stringify(
      { section: sectionNode, subtreeLabels: labels },
      null,
      2
    ) + "\n"
  );
}

if (require.main === module) main();

