const { dfs } = require("../../../scripts/graph/utils/dfs");
const { bfs } = require("../../../scripts/graph/utils/bfs");
const { loadGraph, findTopicNodes, pickTopicMatches } = require("./_loadGraph");

function buildParents(graph) {
  const parents = new Map(); // child -> parent
  for (const e of graph.edges || []) parents.set(e.to, e.from);
  return parents;
}

function usage() {
  return [
    "Usage: node .cursor/tools/graph/dfs-then-bfs-nearby.js <targetLabel> [radiusDepth=1]",
    'Example: node .cursor/tools/graph/dfs-then-bfs-nearby.js "Promises" 1',
  ].join("\n");
}

function main() {
  const targetRaw = process.argv[2];
  const radiusDepth = Number(process.argv[3] ?? "1");

  if (!targetRaw) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const graph = loadGraph();
  const parents = buildParents(graph);

  const picked = pickTopicMatches(findTopicNodes(graph, targetRaw, { order: "dfs" }));
  const found = picked?.nodes[0] ?? null;

  if (!found) {
    process.stdout.write(`NOT_FOUND: ${targetRaw}\n`);
    process.exitCode = 1;
    return;
  }

  // Then BFS locally from the parent (siblings / nearby).
  const anchorId = parents.get(found.id) || found.id;
  const nearby = [];

  bfs(graph, anchorId, {
    maxDepth: Number.isFinite(radiusDepth) ? radiusDepth : 1,
    visit: (node) => nearby.push(node),
  });

  process.stdout.write(
    JSON.stringify(
      { target: found, anchorId, radiusDepth, nearby: nearby.map((n) => ({ id: n.id, label: n.label })) },
      null,
      2
    ) + "\n"
  );
}

if (require.main === module) main();

