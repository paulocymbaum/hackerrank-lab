import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { validateLessonAtPath } from "../../scripts/validate-lesson.mjs";
import { createRequire } from "node:module";
import { makeTmpDir, cleanupTmpDir } from "../helpers/test-tmp.mjs";

const require = createRequire(import.meta.url);
const { loadGraph, parseMindmapText } = {
  loadGraph: require("../../scripts/graph/graph-index.js").loadGraph,
  parseMindmapText: require("../../scripts/graph/parseMindmap.js").parseMindmapText,
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const validateScript = path.join(repoRoot, "scripts/validate-lesson.mjs");

test("valid lesson passes validation", async () => {
  const lessonPath = path.join(repoRoot, "tests/fixtures/mini-course/javascript/modules/01-test-fundamentals/lessons/01.1.1-running-code");
  const graph = parseMindmapText(`mindmap
  root((TestLang))
    01 Test Fundamentals
      01.1 Getting Started
        01.1.1 Running Code`);
  const findings = await validateLessonAtPath(lessonPath, graph, { skipNested: true });
  const errors = findings.filter((f) => f.level === "error");
  assert.equal(errors.length, 0);
});

test("missing lesson.meta.json fails", async () => {
  const tmpDir = makeTmpDir();
  try {
    const lessonPath = path.join(tmpDir, "lesson");
    mkdirSync(lessonPath, { recursive: true });
    cpSync(path.join(repoRoot, "tests/fixtures/mini-course/javascript/modules/01-test-fundamentals/lessons/01.1.1-running-code/README.md"), path.join(lessonPath, "README.md"));
    const graph = loadGraph({ repoRoot });
    const findings = await validateLessonAtPath(lessonPath, graph, { skipNested: true });
    assert.ok(findings.some((f) => f.message.includes("lesson.meta.json")));
  } finally {
    cleanupTmpDir(tmpDir);
  }
});

test("CLI exits 1 when no lessons found", () => {
  const tmpDir = makeTmpDir();
  try {
    assert.throws(() => {
      execFileSync("node", [validateScript, "--course", "nonexistent-course-xyz"], { stdio: "pipe" });
    });
  } finally {
    cleanupTmpDir(tmpDir);
  }
});
