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

module.exports = { loadGraph, normalize };

