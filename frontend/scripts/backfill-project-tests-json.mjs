#!/usr/bin/env node
/**
 * Create or update starter/tests.json for runnable projects.
 * Uses curated overrides first, then README-derived cases.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  countScoredCases,
  deriveProjectTestsFromReadme,
} from "./derive-project-tests-lib.mjs";
import { parseTestsJson } from "./project-test-cases-lib.mjs";
import { getProjectTestOverride } from "./project-tests-overrides.mjs";

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

function resolveCases(projectDir, readmeMarkdown) {
  const slug = path.basename(projectDir);
  const override = getProjectTestOverride(slug);
  if (override?.cases?.length) {
    return override.cases;
  }
  return deriveProjectTestsFromReadme(readmeMarkdown);
}

async function main() {
  const force = process.argv.includes("--force");
  const projects = await findStarterProjects(courseDir);
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const projectDir of projects.sort()) {
    const testsPath = path.join(projectDir, "starter", "tests.json");
    const readme = await fs.readFile(path.join(projectDir, "README.md"), "utf8").catch(() => "");

    let existing = null;
    try {
      existing = await fs.readFile(testsPath, "utf8");
    } catch {
      // missing
    }

    if (existing && !force) {
      const parsed = parseTestsJson(existing);
      if (parsed?.cases?.length && countScoredCases(parsed.cases) > 0) {
        skipped += 1;
        continue;
      }
    }

    const cases = resolveCases(projectDir, readme);
    if (cases.length === 0) {
      process.stderr.write(`No cases derived for ${path.relative(repoRoot, projectDir)}\n`);
      continue;
    }

    const payload = { cases };
    const next = `${JSON.stringify(payload, null, 2)}\n`;

    if (existing === next) {
      skipped += 1;
      continue;
    }

    await fs.mkdir(path.dirname(testsPath), { recursive: true });
    await fs.writeFile(testsPath, next, "utf8");

    if (existing) {
      updated += 1;
      process.stdout.write(`Updated ${path.relative(repoRoot, testsPath)}\n`);
    } else {
      created += 1;
      process.stdout.write(`Created ${path.relative(repoRoot, testsPath)}\n`);
    }
  }

  process.stdout.write(`\nDone: ${created} created, ${updated} updated, ${skipped} skipped.\n`);
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
