function buildAdjacency(graph) {
  const adj = new Map();
  for (const n of graph.nodes || []) adj.set(n.id, []);
  for (const e of graph.edges || []) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from).push(e.to);
  }
  return adj;
}

/**
 * Depth-first traversal (recursive).
 *
 * Options:
 * - visit(node, ctx): called when a node is entered.
 * - shouldSwitch(node, ctx): if returns true, switches to bfs() starting at node.id
 * - getChildren(id, ctx): override child resolution
 * - maxDepth: number (depth from startId)
 * - seen: Set (optional) used to share state when called from bfs()
 */
function dfs(graph, startId, options = {}) {
  const nodesById = new Map((graph.nodes || []).map((n) => [n.id, n]));
  const adj = buildAdjacency(graph);

  const {
    visit,
    shouldSwitch,
    getChildren,
    maxDepth = Infinity,
    seen = new Set(),
  } = options;

  const ctx = {
    graph,
    nodesById,
    adj,
    seen,
    bfs: (id, opts) => require("./bfs").bfs(graph, id, opts),
    dfs: (id, opts) => dfs(graph, id, opts),
  };

  function walk(id, depth) {
    if (id == null) return;
    if (seen.has(id)) return;
    seen.add(id);

    const node = nodesById.get(id) || { id, label: String(id) };
    if (typeof visit === "function") visit(node, ctx);

    if (typeof shouldSwitch === "function" && shouldSwitch(node, ctx)) {
      require("./bfs").bfs(graph, id, { ...options, seen });
      return;
    }

    if (depth >= maxDepth) return;

    const children =
      typeof getChildren === "function"
        ? getChildren(id, ctx) || []
        : adj.get(id) || [];

    for (const childId of children) walk(childId, depth + 1);
  }

  walk(startId, 0);
  return ctx;
}

module.exports = { dfs };

