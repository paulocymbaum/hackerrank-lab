const fs = require("fs");
const path = require("path");

const { parseMindmapText } = require("./parseMindmap");
const { bfs } = require("./utils/bfs");

function loadGraph(options = {}) {
  const {
    txtPath = path.resolve(process.cwd(), "graph/course.graph.txt"),
    jsonPath = path.resolve(process.cwd(), "graph/course.graph.json"),
    preferJson = true,
    repoRoot = process.cwd(),
  } = options;

  const resolvedTxt = path.isAbsolute(txtPath) ? txtPath : path.resolve(repoRoot, txtPath);
  const resolvedJson = path.isAbsolute(jsonPath) ? jsonPath : path.resolve(repoRoot, jsonPath);

  if (preferJson && fs.existsSync(resolvedJson)) {
    return JSON.parse(fs.readFileSync(resolvedJson, "utf8"));
  }

  const txt = fs.readFileSync(resolvedTxt, "utf8");
  const graph = parseMindmapText(txt);

  fs.mkdirSync(path.dirname(resolvedJson), { recursive: true });
  fs.writeFileSync(resolvedJson, JSON.stringify(graph, null, 2), "utf8");

  return graph;
}

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

const INDEX_PREFIX_RE = /^(\d+(?:\.\d+)*)\s+(.*)$/;

function extractIndexPath(label) {
  const m = String(label ?? "")
    .trim()
    .match(/^(\d+(?:\.\d+)*)(?:\s|$)/);
  return m ? m[1] : null;
}

function stripIndexPrefix(label) {
  const m = String(label ?? "").trim().match(INDEX_PREFIX_RE);
  return m ? m[2].trim() : String(label ?? "").trim();
}

function normalizeLabelText(label) {
  return normalize(stripIndexPrefix(label));
}

function normalizeIndexPath(raw) {
  const parts = String(raw ?? "")
    .trim()
    .split(".")
    .filter(Boolean);
  if (!parts.length) return null;

  const normalized = [];
  for (let i = 0; i < parts.length; i += 1) {
    const n = Number(parts[i]);
    if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) return null;
    normalized.push(i === 0 ? String(n).padStart(2, "0") : String(n));
  }
  return normalized.join(".");
}

function indexPathsEqual(a, b) {
  const left = normalizeIndexPath(a);
  const right = normalizeIndexPath(b);
  return left != null && right != null && left === right;
}

function labelsMatch(nodeLabel, query) {
  return normalizeLabelText(nodeLabel) === normalizeLabelText(query);
}

function kebabCase(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function slugFromLabel(label) {
  const index = extractIndexPath(label);
  const text = stripIndexPrefix(label);
  const slug = kebabCase(text);
  return index ? `${index}-${slug}` : slug;
}

function getModuleIndex(graphIndex) {
  const normalized = normalizeIndexPath(graphIndex);
  if (!normalized) return null;
  return normalized.split(".")[0];
}

function buildAdjacency(graph) {
  const adj = new Map();
  for (const n of graph.nodes || []) adj.set(n.id, []);
  for (const e of graph.edges || []) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from).push(e.to);
  }
  return adj;
}

function getChildren(graph, nodeId) {
  const adj = buildAdjacency(graph);
  return adj.get(nodeId) || [];
}

function isLeafNode(graph, nodeId) {
  return getChildren(graph, nodeId).length === 0;
}

function findNodeByIndex(graph, rawIndex) {
  const targetIndex = normalizeIndexPath(rawIndex);
  if (!targetIndex) return null;

  let found = null;
  bfs(graph, graph.rootId, {
    visit: (node) => {
      if (found) return;
      const nodeIndex = extractIndexPath(node.label);
      if (nodeIndex && indexPathsEqual(nodeIndex, targetIndex)) found = node;
    },
  });
  return found;
}

function getAncestorChain(graph, nodeId) {
  const parentByChild = new Map();
  for (const e of graph.edges || []) parentByChild.set(e.to, e.from);

  const chain = [];
  let current = nodeId;
  while (current) {
    const node = (graph.nodes || []).find((n) => n.id === current);
    if (node) chain.unshift(node);
    current = parentByChild.get(current) ?? null;
  }
  return chain;
}

function getModuleNodeForIndex(graph, graphIndex) {
  const moduleIndex = getModuleIndex(graphIndex);
  if (!moduleIndex) return null;
  return findNodeByIndex(graph, moduleIndex);
}

function getLeafDescendants(graph, startId) {
  const leaves = [];
  bfs(graph, startId, {
    visit: (node) => {
      if (isLeafNode(graph, node.id) && extractIndexPath(node.label)) {
        leaves.push(node);
      }
    },
  });
  return leaves.sort((a, b) => {
    const ai = extractIndexPath(a.label) || "";
    const bi = extractIndexPath(b.label) || "";
    return ai.localeCompare(bi, "en", { numeric: true });
  });
}

function courseSlugFromRootLabel(label) {
  return kebabCase(stripIndexPrefix(label) || label);
}

function defaultCourseSlug(graph) {
  const root = (graph.nodes || []).find((n) => n.id === graph.rootId);
  return root ? courseSlugFromRootLabel(root.label) : "javascript";
}

module.exports = {
  loadGraph,
  normalize,
  extractIndexPath,
  stripIndexPrefix,
  normalizeLabelText,
  normalizeIndexPath,
  indexPathsEqual,
  labelsMatch,
  kebabCase,
  slugFromLabel,
  getModuleIndex,
  buildAdjacency,
  getChildren,
  isLeafNode,
  findNodeByIndex,
  getAncestorChain,
  getModuleNodeForIndex,
  getLeafDescendants,
  courseSlugFromRootLabel,
  defaultCourseSlug,
};
