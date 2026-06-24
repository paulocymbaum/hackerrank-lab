import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { generateContentMap } from "../../scripts/graph/generate-content-map.mjs";
import { makeTmpDir, cleanupTmpDir } from "../helpers/test-tmp.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

test("generateContentMap reports exists and planned", async () => {
  const tmpDir = makeTmpDir();
  try {
    const graphDir = path.join(tmpDir, "graph");
    const courseDir = path.join(tmpDir, "course");
    mkdirSync(graphDir, { recursive: true });
    cpSync(path.join(repoRoot, "tests/fixtures/mini-graph.txt"), path.join(graphDir, "course.graph.txt"));
    execFileSync("node", [path.join(repoRoot, "scripts/graph/renderTxtToJson.js"), path.join(graphDir, "course.graph.txt"), path.join(graphDir, "course.graph.json")]);

    cpSync(path.join(repoRoot, "tests/fixtures/mini-course"), courseDir, { recursive: true });

    const map = await generateContentMap({ repoRoot: tmpDir, courseSlug: "javascript" });
    const exists = map.entries.filter((e) => e.status === "exists");
    const planned = map.entries.filter((e) => e.status === "planned");

    assert.ok(exists.some((e) => e.graphIndex === "01.1.1"));
    assert.ok(planned.some((e) => e.graphIndex === "01.1.2"));
    assert.equal(map.exists, exists.length);
    assert.ok(map.planned >= 1);
  } finally {
    cleanupTmpDir(tmpDir);
  }
});
