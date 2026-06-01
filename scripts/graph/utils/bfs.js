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
 * Breadth-first traversal.
 *
 * Options:
 * - visit(node, ctx): called when a node is dequeued.
 * - shouldSwitch(node, ctx): if returns true, switches to dfs() starting at node.id
 * - getChildren(id, ctx): override child resolution
 * - maxDepth: number (depth from startId)
 */
function bfs(graph, startId, options = {}) {
  const nodesById = new Map((graph.nodes || []).map((n) => [n.id, n]));
  const adj = buildAdjacency(graph);

  const {
    visit,
    shouldSwitch,
    getChildren,
    maxDepth = Infinity,
  } = options;

  const q = [{ id: startId, depth: 0 }];
  const seen = new Set();

  const ctx = {
    graph,
    nodesById,
    adj,
    seen,
    bfs: (id, opts) => bfs(graph, id, opts),
    dfs: (id, opts) => require("./dfs").dfs(graph, id, opts),
  };

  while (q.length) {
    const { id, depth } = q.shift();
    if (id == null) continue;
    if (seen.has(id)) continue;
    seen.add(id);

    const node = nodesById.get(id) || { id, label: String(id) };
    if (typeof visit === "function") visit(node, ctx);

    if (typeof shouldSwitch === "function" && shouldSwitch(node, ctx)) {
      // Continue from this node using DFS (shares same seen set).
      require("./dfs").dfs(graph, id, { ...options, seen });
      continue;
    }

    if (depth >= maxDepth) continue;

    const children =
      typeof getChildren === "function"
        ? getChildren(id, ctx) || []
        : adj.get(id) || [];

    for (const childId of children) q.push({ id: childId, depth: depth + 1 });
  }

  return ctx;
}

module.exports = { bfs };

