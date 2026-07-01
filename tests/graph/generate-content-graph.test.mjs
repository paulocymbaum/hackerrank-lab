import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { generateContentGraph } from "../../scripts/graph/generate-content-graph.mjs";
import { makeTmpDir, cleanupTmpDir } from "../helpers/test-tmp.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function collectLeaves(node) {
  if (node.kind === "lesson") return [node];
  return (node.children || []).flatMap(collectLeaves);
}

test("generateContentGraph builds nested tree with exists and planned leaves", async () => {
  const tmpDir = makeTmpDir();
  try {
    const graphDir = path.join(tmpDir, "graph");
    mkdirSync(graphDir, { recursive: true });
    cpSync(path.join(repoRoot, "tests/fixtures/mini-graph.txt"), path.join(graphDir, "course.graph.txt"));
    execFileSync("node", [
      path.join(repoRoot, "scripts/graph/renderTxtToJson.js"),
      path.join(graphDir, "course.graph.txt"),
      path.join(graphDir, "course.graph.json"),
    ]);

    cpSync(path.join(repoRoot, "tests/fixtures/mini-course"), path.join(tmpDir, "course"), {
      recursive: true,
    });

    const graph = await generateContentGraph({ repoRoot: tmpDir, courseSlug: "javascript" });

    assert.equal(graph.root.kind, "root");
    assert.ok(graph.root.children.length >= 1);
    assert.equal(graph.root.children[0].kind, "module");

    const leaves = collectLeaves(graph.root);
    assert.ok(leaves.some((l) => l.graphIndex === "01.1.1" && l.status === "exists"));
    assert.ok(leaves.some((l) => l.graphIndex === "01.1.2" && l.status === "planned"));
    assert.ok(
      leaves.find((l) => l.graphIndex === "01.1.1")?.catalogRef?.lessonId,
    );
    assert.equal(graph.stats.exists, leaves.filter((l) => l.status === "exists").length);
    assert.equal(graph.stats.planned, leaves.filter((l) => l.status === "planned").length);
  } finally {
    cleanupTmpDir(tmpDir);
  }
});
