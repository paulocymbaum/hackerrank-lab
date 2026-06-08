const fs = require("fs");
const path = require("path");

const { parseMindmapText } = require("../../../scripts/graph/parseMindmap");
const { bfs } = require("../../../scripts/graph/utils/bfs");
const { dfs } = require("../../../scripts/graph/utils/dfs");

function loadGraph(options = {}) {
  const {
    txtPath = path.resolve(process.cwd(), "graph/course.graph.txt"),
    jsonPath = path.resolve(process.cwd(), "graph/course.graph.json"),
    preferJson = true,
  } = options;

  if (preferJson && fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  }

  const txt = fs.readFileSync(txtPath, "utf8");
  const graph = parseMindmapText(txt);

  // Keep json output in sync for convenience.
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(graph, null, 2), "utf8");

  return graph;
}

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

/** @returns {"exact" | "substring" | null} */
function matchLabel(label, target) {
  const normalized = normalize(label);
  if (normalized === target) return "exact";
  if (target && normalized.includes(target)) return "substring";
  return null;
}

/**
 * Find nodes whose label equals or contains the query (case-insensitive).
 * Exact matches are collected separately and preferred over substring matches.
 *
 * @param {"bfs" | "dfs"} order
 */
function findTopicNodes(graph, targetRaw, { order = "bfs" } = {}) {
  const target = normalize(targetRaw);
  const exact = [];
  const substring = [];

  const visit = (node) => {
    const kind = matchLabel(node.label, target);
    if (kind === "exact") exact.push(node);
    else if (kind === "substring") substring.push(node);
  };

  const traverse = order === "dfs" ? dfs : bfs;
  traverse(graph, graph.rootId, { visit });

  return { exact, substring };
}

function pickTopicMatches({ exact, substring }) {
  if (exact.length) return { matchType: "exact", nodes: exact };
  if (substring.length) return { matchType: "substring", nodes: substring };
  return null;
}

/**
 * @returns {object | null} JSON-serializable result; null when nothing matches.
 */
function formatTopicFindResult(targetRaw, picked) {
  if (!picked) return null;

  const { matchType, nodes } = picked;
  if (nodes.length === 1) {
    return { id: nodes[0].id, label: nodes[0].label, matchType };
  }

  return {
    matchType,
    query: targetRaw,
    matches: nodes.map((n) => ({ id: n.id, label: n.label })),
  };
}

function findTopic(graph, targetRaw, { order = "bfs" } = {}) {
  return formatTopicFindResult(targetRaw, pickTopicMatches(findTopicNodes(graph, targetRaw, { order })));
}

module.exports = {
  loadGraph,
  normalize,
  matchLabel,
  findTopicNodes,
  pickTopicMatches,
  formatTopicFindResult,
  findTopic,
};

