#!/usr/bin/env node
/**
 * Verify starter/tests.json across runnable projects.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { countScoredCases, deriveProjectTestsFromReadme } from "./derive-project-tests-lib.mjs";
import { parseTestsJson } from "./project-test-cases-lib.mjs";
import { runProjectTestMatrix } from "./project-run-lib.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const courseDir = path.join(repoRoot, "course");

async function findStarterProjects(dir, found = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await findStarterProjects(abs, found);
      continue;
    }
    if (entry.name === "index.js" && abs.includes(`${path.sep}starter${path.sep}`)) {
      found.push(path.dirname(path.dirname(abs)));
    }
  }
  return found;
}

function relProjectPath(projectDir) {
  return path.relative(repoRoot, projectDir).split(path.sep).join("/");
}

async function resolveReferenceCode(projectDir) {
  const solutionPath = path.join(projectDir, "solution", "index.js");
  try {
    return await fs.readFile(solutionPath, "utf8");
  } catch {
    return null;
  }
}

async function main() {
  const checkSchemaOnly = process.argv.includes("--check-schema");
  const runReference = process.argv.includes("--run-reference");
  const projects = await findStarterProjects(courseDir);
  let failures = 0;

  for (const projectDir of projects.sort()) {
    const rel = relProjectPath(projectDir);
    const testsPath = path.join(projectDir, "starter", "tests.json");
    const raw = await fs.readFile(testsPath, "utf8").catch(() => "");

    const parsed = parseTestsJson(raw);
    if (!parsed?.cases?.length) {
      process.stderr.write(`FAIL ${rel}: missing or invalid tests.json\n`);
      failures += 1;
      continue;
    }

    if (countScoredCases(parsed.cases) === 0) {
      process.stderr.write(`FAIL ${rel}: no scored test cases\n`);
      failures += 1;
      continue;
    }

    if (checkSchemaOnly) {
      process.stdout.write(`OK ${rel}: ${parsed.cases.length} cases, ${countScoredCases(parsed.cases)} scored\n`);
      continue;
    }

    if (!runReference) continue;

    const referenceCode = await resolveReferenceCode(projectDir);
    if (!referenceCode) continue;

    const result = await runProjectTestMatrix({
      repoRoot,
      rootPath: rel,
      code: referenceCode,
    });

    if (!result.ok) {
      process.stderr.write(`FAIL ${rel}: run error ${result.error}\n`);
      failures += 1;
      continue;
    }

    if (result.matrix.failedCount > 0) {
      process.stderr.write(
        `FAIL ${rel}: ${result.matrix.failedCount} failed against solution\n`,
      );
      failures += 1;
      continue;
    }

    process.stdout.write(`OK ${rel}: solution passed ${result.matrix.passedCount} cases\n`);
  }

  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
