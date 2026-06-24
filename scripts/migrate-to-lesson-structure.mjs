#!/usr/bin/env node
/**
 * Migrate legacy flat module folders to hierarchy structure.
 *
 * Usage:
 *   node scripts/migrate-to-lesson-structure.mjs --dry-run --module 01-javascript-fundamentals
 *   node scripts/migrate-to-lesson-structure.mjs --module 01-javascript-fundamentals --keep-legacy
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { slugFromLabel, loadGraph, findNodeByIndex } = require("./graph/graph-index.js");

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const courseDir = path.join(repoRoot, "course");
const COURSE_SLUG = "javascript";

const EXAMPLE_TO_LESSON = {
  "01-truthy-falsy.md": "01.8.1-truthy-vs-falsy",
  "02-equality-and-coercion.md": "01.8.2-strict-equality",
  "03-null-undefined-and-operators.md": "01.8.5-null-undefined-null",
  "01-reference-vs-value.md": "02.1-reference-vs-value",
  "02-shallow-copy-pitfalls.md": "02.2-shallow-vs-deep-copy",
  "03-deep-copy-and-structuredclone.md": "02.3-structuredclone",
  "01-sync-vs-async-trace.md": "03.1.1-single-threaded-execution",
  "02-event-loop-microtasks-vs-tasks.md": "03.1.4-callback-and-microtask-queues",
  "03-promises-async-await-and-error-flow.md": "03.2.3-try-catch-error-handling",
};

const PROJECT_TO_LESSON = {
  "01-coercion-and-validation/001-cli-input-validator": "01.8.1-truthy-vs-falsy",
  "01-coercion-and-validation/002-data-normalizer": "01.8.3-type-coercion",
  "02-comparisons-and-rules/003-record-filter": "01.8.2-strict-equality",
  "01-data-shaping-and-safety/001-safe-normalizer": "02.1-reference-vs-value",
  "01-event-loop-basics/001-output-order-predictor": "03.1.2-event-loop",
  "02-promises-and-async/002-retry-with-backoff": "03.2.1-promises",
  "02-promises-and-async/003-concurrency-limiter": "03.2.2-async-await",
};

function parseArgs(argv) {
  const args = { dryRun: false, keepLegacy: false, module: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--keep-legacy") args.keepLegacy = true;
    else if (arg === "--module") args.module = argv[++i];
  }
  return args;
}

async function copyFile(src, dest, dryRun) {
  if (dryRun) return { action: "copy", from: src, to: dest };
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
  return { action: "copied", from: src, to: dest };
}

async function copyDir(src, dest, dryRun) {
  const actions = [];
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const ent of entries) {
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      actions.push(...(await copyDir(s, d, dryRun)));
    } else {
      actions.push(await copyFile(s, d, dryRun));
    }
  }
  return actions;
}

async function migrateModule(moduleId, args) {
  const graph = loadGraph({ repoRoot });
  const legacyPath = path.join(courseDir, moduleId);
  const moduleNode = findNodeByIndex(graph, moduleId.match(/^(\d{2})/)?.[1]);
  const targetModuleId = moduleNode ? slugFromLabel(moduleNode.label) : moduleId;
  const targetModulePath = path.join(courseDir, COURSE_SLUG, "modules", targetModuleId);
  const actions = [];

  try {
    await fs.access(legacyPath);
  } catch {
    throw new Error(`Legacy module not found: ${moduleId}`);
  }

  if (!args.dryRun) {
    execFileSync("node", [path.join(repoRoot, "scripts/graph/scaffold-from-graph.mjs"), "--module", moduleId.match(/^(\d{2})/)?.[1], "--no-leaves"], {
      cwd: repoRoot,
      stdio: "inherit",
    });
  } else {
    actions.push({ action: "scaffold-module", module: targetModuleId });
  }

  const legacyReadme = path.join(legacyPath, "README.md");
  const targetReadme = path.join(targetModulePath, "README.md");
  if (await exists(legacyReadme)) {
    actions.push(await copyFile(legacyReadme, targetReadme, args.dryRun));
  }

  const examplesDir = path.join(legacyPath, "examples");
  try {
    const examples = await fs.readdir(examplesDir);
    for (const file of examples.filter((f) => f.endsWith(".md"))) {
      const lessonId = EXAMPLE_TO_LESSON[file];
      if (!lessonId) {
        actions.push({ action: "skip", reason: "no mapping", file });
        continue;
      }
      const graphIndex = lessonId.match(/^(\d+(?:\.\d+)*)/)?.[1];
      if (!args.dryRun) {
        execFileSync("node", [path.join(repoRoot, "scripts/graph/scaffold-from-graph.mjs"), graphIndex], {
          cwd: repoRoot,
          stdio: "pipe",
        });
      }
      const lessonPath = path.join(targetModulePath, "lessons", lessonId);
      actions.push(await copyFile(path.join(examplesDir, file), path.join(lessonPath, "README.md"), args.dryRun));
    }
  } catch {
    // no examples
  }

  const projectsRoot = path.join(legacyPath, "projects");
  for (const [rel, lessonId] of Object.entries(PROJECT_TO_LESSON)) {
    const srcProject = path.join(projectsRoot, rel);
    try {
      await fs.access(srcProject);
    } catch {
      continue;
    }
    const projectName = path.basename(rel);
    const lessonPath = path.join(targetModulePath, "lessons", lessonId, "projects", projectName);
    if (!args.dryRun) {
      execFileSync("node", [path.join(repoRoot, "scripts/graph/scaffold-from-graph.mjs"), lessonId.match(/^(\d+(?:\.\d+)*)/)?.[1]], {
        cwd: repoRoot,
        stdio: "pipe",
      });
    }
    actions.push(...(await copyDir(srcProject, lessonPath, args.dryRun)));
  }

  const quizDir = path.join(legacyPath, "quiz");
  try {
    const quizzes = (await fs.readdir(quizDir)).filter((f) => f.endsWith(".json") && f !== "score.json");
    if (quizzes.length) {
      const targetQuizDir = path.join(targetModulePath, "quiz");
      for (const quiz of quizzes) {
        actions.push(await copyFile(path.join(quizDir, quiz), path.join(targetQuizDir, quiz), args.dryRun));
      }
    }
  } catch {
    // no quiz
  }

  if (!args.keepLegacy && !args.dryRun) {
    actions.push({ action: "keep-legacy", moduleId, note: "legacy folder preserved (use --keep-legacy explicitly to document)" });
  }

  return { moduleId, targetModuleId, actions };
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const modules = args.module
    ? [args.module]
    : ["01-javascript-fundamentals", "02-objects-references-and-copying", "03-asynchronous-javascript-runtime-model-event-loop"];

  const results = [];
  for (const moduleId of modules) {
    if (!moduleId.startsWith("0")) continue;
    results.push(await migrateModule(moduleId, args));
  }

  process.stdout.write(JSON.stringify({ dryRun: args.dryRun, results }, null, 2) + "\n");

  if (!args.dryRun) {
    execFileSync("node", [path.join(repoRoot, "scripts/graph/generate-content-map.mjs")], { cwd: repoRoot, stdio: "inherit" });
  }
}

main().catch((err) => {
  process.stderr.write(String(err?.stack || err) + "\n");
  process.exit(1);
});
