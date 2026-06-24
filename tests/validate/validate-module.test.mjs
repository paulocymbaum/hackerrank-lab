import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { validateModuleAtPath } from "../../scripts/validate-module.mjs";
import { makeTmpDir, cleanupTmpDir } from "../helpers/test-tmp.mjs";

const require = createRequire(import.meta.url);
const { parseMindmapText } = require("../../scripts/graph/parseMindmap.js");

const MINI_GRAPH = parseMindmapText(`mindmap
  root((TestLang))
    01 Test Fundamentals
      01.1 Getting Started
        01.1.1 Running Code`);

test("module with lessons passes", async () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
  const modulePath = path.join(repoRoot, "tests/fixtures/mini-course/javascript/modules/01-test-fundamentals");
  const findings = await validateModuleAtPath(modulePath, MINI_GRAPH);
  const errors = findings.filter((f) => f.level === "error");
  assert.equal(errors.length, 0);
});

test("module with zero lessons fails", async () => {
  const tmpDir = makeTmpDir();
  try {
    const modulePath = path.join(tmpDir, "01-empty-module");
    mkdirSync(modulePath, { recursive: true });
    mkdirSync(path.join(modulePath, "lessons"));
    writeFileSync(path.join(modulePath, "README.md"), "# Empty\n");
    writeFileSync(path.join(modulePath, "module.meta.json"), JSON.stringify({
      id: "01-empty-module", graphIndex: "01", graphNodeId: "n1", title: "Empty",
    }));
    const findings = await validateModuleAtPath(modulePath, MINI_GRAPH);
    assert.ok(findings.some((f) => f.message.includes("No lessons found")));
  } finally {
    cleanupTmpDir(tmpDir);
  }
});
