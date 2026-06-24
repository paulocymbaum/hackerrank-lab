import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateContentMap } from "../../scripts/graph/generate-content-map.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

test("authoring workflow: scaffold → explain → project → content-map", async () => {
  const lessonId = "01.8.4-typeof-and-array-isarray";
  const lessonPath = path.join(repoRoot, "course/javascript/modules/01-javascript-fundamentals/lessons", lessonId);
  const metaPath = path.join(lessonPath, "lesson.meta.json");

  if (existsSync(lessonPath)) {
    rmSync(lessonPath, { recursive: true, force: true });
  }

  execFileSync("node", [path.join(repoRoot, "scripts/graph/scaffold-from-graph.mjs"), "01.8.4"], { cwd: repoRoot });
  assert.ok(existsSync(metaPath));

  execFileSync("node", [
    path.join(repoRoot, ".cursor/tools/teacher/add-explanation.js"),
    "javascript", "01-javascript-fundamentals", lessonId,
  ], {
    cwd: repoRoot,
    input: "## Explanation\n\ntypeof and Array.isArray.\n",
  });

  const readme = readFileSync(path.join(lessonPath, "README.md"), "utf8");
  assert.ok(readme.includes("typeof and Array.isArray"));

  execFileSync("node", [
    path.join(repoRoot, ".cursor/tools/teacher/add-project-idea.js"),
    "javascript", "01-javascript-fundamentals", lessonId, "1", "Type Inspector",
  ], { cwd: repoRoot });

  assert.ok(existsSync(path.join(lessonPath, "projects/001-type-inspector/README.md")));

  const map = await generateContentMap({ repoRoot });
  assert.ok(map.entries.some((e) => e.graphIndex === "01.8.4" && e.status === "exists"));

  rmSync(lessonPath, { recursive: true, force: true });
});
