const fs = require("fs");
const path = require("path");

const { parseMindmapText } = require("../../../scripts/graph/parseMindmap");

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

module.exports = {
  loadGraph,
  normalize,
  extractIndexPath,
  stripIndexPrefix,
  normalizeLabelText,
  normalizeIndexPath,
  indexPathsEqual,
  labelsMatch,
};

