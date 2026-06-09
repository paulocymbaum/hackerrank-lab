import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  extractIndexPath,
  normalizeIndexPath,
  getModuleIndex,
  slugFromLabel,
  isLeafNode,
  findNodeByIndex,
} = require("../../scripts/graph/graph-index.js");
const { parseMindmapText } = require("../../scripts/graph/parseMindmap.js");

const MINI_GRAPH = `mindmap
  root((TestLang))
    01 Test Fundamentals
      01.1 Getting Started
        01.1.1 Running Code
        01.1.2 Output Basics
      01.2 Variables
        01.2.1 let and const`;

function loadMiniGraph() {
  return parseMindmapText(MINI_GRAPH);
}

test("extractIndexPath parses label prefix", () => {
  assert.equal(extractIndexPath("01.8.1 Truthy vs Falsy"), "01.8.1");
  assert.equal(extractIndexPath("01 JavaScript Fundamentals"), "01");
});

test("normalizeIndexPath pads first segment", () => {
  assert.equal(normalizeIndexPath("1.8.1"), "01.8.1");
  assert.equal(normalizeIndexPath("01.8.1"), "01.8.1");
});

test("getModuleIndex returns top-level segment", () => {
  assert.equal(getModuleIndex("01.8.1"), "01");
});

test("slugFromLabel builds graphIndex-slug", () => {
  assert.equal(slugFromLabel("01.8.1 Truthy vs Falsy"), "01.8.1-truthy-vs-falsy");
});

test("isLeafNode detects leaves", () => {
  const graph = loadMiniGraph();
  const leaf = findNodeByIndex(graph, "01.1.1");
  const section = findNodeByIndex(graph, "01.1");
  assert.ok(leaf);
  assert.ok(section);
  assert.equal(isLeafNode(graph, leaf.id), true);
  assert.equal(isLeafNode(graph, section.id), false);
});

test("findNodeByIndex returns null for invalid index", () => {
  const graph = loadMiniGraph();
  assert.equal(findNodeByIndex(graph, "99.9.9"), null);
});
