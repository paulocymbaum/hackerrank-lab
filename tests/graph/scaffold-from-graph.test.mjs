import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { makeTmpDir, cleanupTmpDir } from "../helpers/test-tmp.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const scaffoldScript = path.join(repoRoot, "scripts/graph/scaffold-from-graph.mjs");

test("dry-run returns planned paths without creating files", () => {
  const out = execFileSync("node", [scaffoldScript, "01.8.1", "--dry-run"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const parsed = JSON.parse(out);
  assert.equal(parsed.dryRun, true);
  assert.equal(parsed.kind, "lesson");
  assert.ok(Array.isArray(parsed.planned));
});

test("scaffold creates lesson.meta.json with correct graphIndex", () => {
  const tmpCourse = path.join(repoRoot, "course", "javascript", "modules", "01-javascript-fundamentals", "lessons", "01.8.1-truthy-vs-falsy");
  const metaPath = path.join(tmpCourse, "lesson.meta.json");
  const hadMeta = existsSync(metaPath);
  const backup = hadMeta ? readFileSync(metaPath, "utf8") : null;

  try {
    if (hadMeta) rmSync(metaPath);
    const out = execFileSync("node", [scaffoldScript, "01.8.1"], { cwd: repoRoot, encoding: "utf8" });
    const parsed = JSON.parse(out);
    assert.equal(parsed.kind, "lesson");
    const meta = JSON.parse(readFileSync(metaPath, "utf8"));
    assert.equal(meta.graphIndex, "01.8.1");
  } finally {
    if (backup) writeFileSync(metaPath, backup);
    else if (existsSync(metaPath)) rmSync(metaPath);
  }
});

test("scaffold is idempotent for README", () => {
  const readmePath = path.join(repoRoot, "course/javascript/modules/01-javascript-fundamentals/lessons/01.8.2-strict-equality/README.md");
  const original = readFileSync(readmePath, "utf8");
  writeFileSync(readmePath, "# Custom preserved content\n", "utf8");
  try {
    execFileSync("node", [scaffoldScript, "01.8.2"], { cwd: repoRoot });
    assert.equal(readFileSync(readmePath, "utf8"), "# Custom preserved content\n");
  } finally {
    writeFileSync(readmePath, original, "utf8");
  }
});
