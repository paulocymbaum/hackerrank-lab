import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("migrate-score-to-hierarchy", () => {
  it("dry-run reports migration plan without error", async () => {
    const scriptPath = path.join(repoRoot, "scripts/migrate-score-to-hierarchy.mjs");
    const { stdout } = await execFileAsync("node", [scriptPath, "--dry-run"], {
      cwd: repoRoot,
    });

    const result = JSON.parse(stdout);
    assert.equal(result.dryRun, true);
    assert.ok(Array.isArray(result.results));
  });

  it("target score path exists after migration", async () => {
    const scorePath = path.join(repoRoot, "course/javascript/quiz/score.json");
    let exists = true;
    try {
      await fs.access(scorePath);
    } catch {
      exists = false;
    }

    if (!exists) {
      const scriptPath = path.join(repoRoot, "scripts/migrate-score-to-hierarchy.mjs");
      await execFileAsync("node", [scriptPath], { cwd: repoRoot });
    }

    const raw = await fs.readFile(scorePath, "utf8");
    const score = JSON.parse(raw);
    assert.equal(score.courseId, "javascript");
    assert.ok(score.projects);
  });
});
