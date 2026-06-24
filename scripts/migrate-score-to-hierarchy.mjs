#!/usr/bin/env node
/**
 * Migrate legacy score.json and project-delivery courseId to hierarchy course slug.
 *
 * Usage:
 *   node scripts/migrate-score-to-hierarchy.mjs [--dry-run]
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

const LEGACY_MODULE_TO_COURSE = {
  "01-javascript-fundamentals": "javascript",
  "02-objects-references-and-copying": "javascript",
  "03-asynchronous-javascript-runtime-model-event-loop": "javascript",
};

const PROJECT_DELIVERY_FILENAME = "project-delivery.json";

function parseArgs(argv) {
  return { dryRun: argv.includes("--dry-run") };
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function loadCatalogProjectMap() {
  const catalogPath = path.join(repoRoot, "frontend/src/infrastructure/static/catalog.json");
  const catalog = await readJson(catalogPath);
  const map = new Map();

  for (const course of catalog.courses ?? []) {
    for (const project of course.projects ?? []) {
      if (project.lessonId) map.set(project.id, project.lessonId);
    }
    for (const mod of course.modules ?? []) {
      for (const project of mod.projects ?? []) {
        if (project.lessonId) map.set(project.id, project.lessonId);
      }
    }
  }

  return map;
}

function remapProjectKey(projectId, lessonMap) {
  const lessonId = lessonMap.get(projectId);
  return lessonId ? `${lessonId}/${projectId}` : projectId;
}

async function migrateScoreFile(legacyModuleId, targetCourseId, lessonMap, dryRun) {
  const sourcePath = path.join(repoRoot, "course", legacyModuleId, "quiz", "score.json");
  const targetPath = path.join(repoRoot, "course", targetCourseId, "quiz", "score.json");

  let source;
  try {
    source = await readJson(sourcePath);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      return { migrated: false, reason: "missing" };
    }
    throw err;
  }

  const remappedProjects = {};
  for (const [key, entry] of Object.entries(source.projects ?? {})) {
    const plainId = entry.projectId ?? key;
    const storageKey = remapProjectKey(plainId, lessonMap);
    remappedProjects[storageKey] = { ...entry, projectId: storageKey };
  }

  let target = {
    version: 2,
    courseId: targetCourseId,
    updatedAt: new Date().toISOString(),
    quizzes: { ...(source.quizzes ?? {}) },
    projects: remappedProjects,
  };

  try {
    const existing = await readJson(targetPath);
    if (existing && typeof existing === "object") {
      target = {
        ...target,
        quizzes: { ...(existing.quizzes ?? {}), ...target.quizzes },
        projects: { ...(existing.projects ?? {}), ...target.projects },
        updatedAt: new Date().toISOString(),
      };
    }
  } catch (err) {
    if (!(err && typeof err === "object" && "code" in err && err.code === "ENOENT")) {
      throw err;
    }
  }

  if (!dryRun) {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, JSON.stringify(target, null, 2) + "\n", "utf8");
  }

  return {
    migrated: true,
    sourcePath,
    targetPath,
    projectCount: Object.keys(remappedProjects).length,
    quizCount: Object.keys(target.quizzes).length,
  };
}

async function walkDir(dir, visitor) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(full, visitor);
    } else if (entry.name === PROJECT_DELIVERY_FILENAME) {
      await visitor(full);
    }
  }
}

async function migrateDeliveryFiles(targetCourseId, dryRun) {
  const courseRoot = path.join(repoRoot, "course", targetCourseId);
  const updates = [];

  await walkDir(courseRoot, async (filePath) => {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    if (parsed.courseId === targetCourseId) return;

    const next = { ...parsed, courseId: targetCourseId };
    updates.push(filePath);
    if (!dryRun) {
      await fs.writeFile(filePath, JSON.stringify(next, null, 2) + "\n", "utf8");
    }
  });

  return updates;
}

async function main() {
  const { dryRun } = parseArgs(process.argv);
  const lessonMap = await loadCatalogProjectMap();
  const results = [];

  for (const [legacyModuleId, targetCourseId] of Object.entries(LEGACY_MODULE_TO_COURSE)) {
    const scoreResult = await migrateScoreFile(legacyModuleId, targetCourseId, lessonMap, dryRun);
    results.push({ legacyModuleId, targetCourseId, score: scoreResult });
  }

  const deliveryUpdates = await migrateDeliveryFiles("javascript", dryRun);

  process.stdout.write(
    `${JSON.stringify(
      {
        dryRun,
        results,
        deliveryFilesUpdated: deliveryUpdates.length,
        deliveryPaths: deliveryUpdates,
      },
      null,
      2,
    )}\n`,
  );
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
