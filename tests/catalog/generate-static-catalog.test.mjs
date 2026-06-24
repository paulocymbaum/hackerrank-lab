import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { makeTmpDir, cleanupTmpDir } from "../helpers/test-tmp.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const catalogScript = path.join(repoRoot, "frontend/scripts/generate-static-catalog.mjs");

test("catalog includes hierarchy lessons with graphIndex", () => {
  const catalogPath = path.join(repoRoot, "frontend/src/infrastructure/static/catalog.json");
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  const jsCourse = catalog.courses.find((c) => c.id === "javascript");
  assert.ok(jsCourse, "javascript hierarchy course should exist");
  assert.ok(jsCourse.modules?.length > 0, "should have modules");
  const withGraphIndex = jsCourse.lessons.filter((l) => l.graphIndex);
  assert.ok(withGraphIndex.length > 0, "lessons should have graphIndex");
});

test("migrated modules are served from hierarchy course not duplicated as legacy", () => {
  const catalogPath = path.join(repoRoot, "frontend/src/infrastructure/static/catalog.json");
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  const jsCourse = catalog.courses.find((c) => c.id === "javascript");
  const legacyDup = catalog.courses.find((c) => c.id === "01-javascript-fundamentals");
  assert.ok(jsCourse?.modules?.some((m) => m.id === "01-javascript-fundamentals"));
  assert.equal(legacyDup, undefined, "migrated module should not appear as separate legacy course");
});

test("catalog generation works in isolated tmp repo", () => {
  const tmpDir = makeTmpDir();
  try {
    const courseDir = path.join(tmpDir, "course");
    cpSync(path.join(repoRoot, "tests/fixtures/mini-course"), courseDir, { recursive: true });

    const legacyModule = path.join(courseDir, "01-legacy-module");
    mkdirSync(path.join(legacyModule, "examples"), { recursive: true });
    writeFileSync(path.join(legacyModule, "README.md"), "# Legacy\n");
    writeFileSync(path.join(legacyModule, "examples", "01-sample.md"), "# Sample\n");

    const frontendDir = path.join(tmpDir, "frontend/scripts");
    mkdirSync(frontendDir, { recursive: true });
    const script = readFileSync(catalogScript, "utf8").replace(
      'const repoRoot = path.resolve(scriptDir, "..", "..");',
      `const repoRoot = ${JSON.stringify(tmpDir)};`,
    );
    writeFileSync(path.join(frontendDir, "generate-static-catalog.mjs"), script);

    execFileSync("node", [path.join(frontendDir, "generate-static-catalog.mjs")], { cwd: tmpDir });

    const outPath = path.join(tmpDir, "frontend/src/infrastructure/static/catalog.json");
    const catalog = JSON.parse(readFileSync(outPath, "utf8"));
    assert.equal(catalog.courses.length, 2);
    const hierarchy = catalog.courses.find((c) => c.id === "javascript");
    assert.ok(hierarchy.lessons.some((l) => l.graphIndex === "01.1.1"));
  } finally {
    cleanupTmpDir(tmpDir);
  }
});
