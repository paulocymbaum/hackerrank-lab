const crypto = require("crypto");

function normalizeLabel(raw) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return "";

  // Mermaid mindmap often has "root((Label))" or "something((Label))"
  // We keep the innermost label while preserving plain lines.
  const rootWrapped = trimmed.match(/^\w+\(\((.*)\)\)$/);
  if (rootWrapped) return rootWrapped[1].trim();

  const wrapped = trimmed.match(/^\(\((.*)\)\)$/);
  if (wrapped) return wrapped[1].trim();

  return trimmed;
}

function countIndentSpaces(line) {
  const m = String(line).match(/^(\s*)/);
  return m ? m[1].length : 0;
}

function stableId(label, parentId) {
  // Deterministic-ish ID: hash(label + parent) so re-parsing is stable.
  const h = crypto
    .createHash("sha1")
    .update(`${parentId || "ROOT"}\u0000${label}`)
    .digest("hex")
    .slice(0, 10);
  return `n_${h}`;
}

/**
 * Parse a Mermaid mindmap text file that uses indentation as hierarchy.
 *
 * Output:
 * {
 *   rootId: string | null,
 *   nodes: [{ id, label }],
 *   edges: [{ from, to }]
 * }
 */
function parseMindmapText(text) {
  const lines = String(text ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n");

  const nodesById = new Map();
  const edges = [];

  // Stack holds the last node id at each depth.
  // depth is derived from indentation in spaces / 2 (Mermaid uses 2 spaces typically),
  // but we fall back gracefully if the input doesn't follow strict multiples.
  const stack = [];

  let rootId = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, "  ");
    const labelRaw = line.trim();
    if (!labelRaw) continue;
    if (labelRaw === "mindmap") continue;

    const indentSpaces = countIndentSpaces(line);
    const depth = Math.floor(indentSpaces / 2);
    const label = normalizeLabel(labelRaw);
    if (!label) continue;

    // Ensure stack length == depth (parent at depth-1)
    while (stack.length > depth) stack.pop();

    const parentId = stack.length ? stack[stack.length - 1] : null;
    const id = stableId(label, parentId);

    if (!nodesById.has(id)) nodesById.set(id, { id, label });
    if (!rootId) rootId = id;

    if (parentId) edges.push({ from: parentId, to: id });

    // Push this node as current at this depth
    stack.push(id);
  }

  return {
    rootId,
    nodes: Array.from(nodesById.values()),
    edges,
  };
}

module.exports = {
  parseMindmapText,
};

