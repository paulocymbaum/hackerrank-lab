#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath used for isMain guard below
import {
  loadGraph,
  extractIndexPath,
  isLeafNode,
  defaultCourseSlug,
} from "./graph-index.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const courseDir = path.join(repoRoot, "course");
const outPath = path.join(repoRoot, "graph/content-map.json");

async function listDirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function readJsonSafe(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

function preferDiskEntry(existing, candidate, preferCourseId) {
  if (!existing) return candidate;
  if (!preferCourseId) return existing;
  if (existing.courseId === preferCourseId) return existing;
  if (candidate.courseId === preferCourseId) return candidate;
  return existing;
}

export async function scanDiskLessons(root, options = {}) {
  const preferCourseId = options.preferCourseId ?? null;
  const byGraphIndex = new Map();
  const orphans = [];
  const scanCourseDir = path.join(root, "course");

  const courseEntries = await listDirSafe(scanCourseDir);
  for (const courseEnt of courseEntries.filter((e) => e.isDirectory())) {
    const coursePath = path.join(scanCourseDir, courseEnt.name);
    const modulesPath = path.join(coursePath, "modules");
    const moduleEntries = await listDirSafe(modulesPath);

    for (const modEnt of moduleEntries.filter((e) => e.isDirectory())) {
      const lessonsPath = path.join(modulesPath, modEnt.name, "lessons");
      const lessonEntries = await listDirSafe(lessonsPath);

      for (const lessonEnt of lessonEntries.filter((e) => e.isDirectory())) {
        const lessonPath = path.join(lessonsPath, lessonEnt.name);
        const meta = await readJsonSafe(path.join(lessonPath, "lesson.meta.json"));
        const graphIndex = meta?.graphIndex ?? extractIndexPath(lessonEnt.name);

        const entry = {
          graphIndex,
          courseId: courseEnt.name,
          moduleId: modEnt.name,
          lessonId: lessonEnt.name,
          diskPath: path.relative(root, lessonPath),
          status: "exists",
        };

        if (graphIndex) {
          byGraphIndex.set(
            graphIndex,
            preferDiskEntry(byGraphIndex.get(graphIndex), entry, preferCourseId),
          );
        } else {
          orphans.push({ ...entry, status: "orphan", reason: "missing graphIndex" });
        }
      }
    }
  }

  return { byGraphIndex, orphans };
}

export async function generateContentMap(options = {}) {
  const root = options.repoRoot ?? repoRoot;
  const graph = loadGraph({
    repoRoot: root,
    jsonPath: path.join(root, "graph/course.graph.json"),
    txtPath: path.join(root, "graph/course.graph.txt"),
  });
  const courseSlug = options.courseSlug ?? defaultCourseSlug(graph);
  const { byGraphIndex, orphans } = await scanDiskLessons(root, { preferCourseId: courseSlug });

  const entries = [];

  for (const node of graph.nodes || []) {
    if (!isLeafNode(graph, node.id)) continue;
    const graphIndex = extractIndexPath(node.label);
    if (!graphIndex) continue;

    const existing = byGraphIndex.get(graphIndex);
    if (existing) {
      entries.push(existing);
      byGraphIndex.delete(graphIndex);
    } else {
      entries.push({
        graphIndex,
        courseId: courseSlug,
        moduleId: null,
        lessonId: null,
        diskPath: null,
        status: "planned",
        title: node.label,
      });
    }
  }

  for (const [, leftover] of byGraphIndex) {
    entries.push({ ...leftover, status: "orphan", reason: "no matching graph leaf" });
  }
  entries.push(...orphans);

  entries.sort((a, b) => (a.graphIndex || "").localeCompare(b.graphIndex || "", "en", { numeric: true }));

  const map = {
    generatedAt: new Date().toISOString(),
    courseSlug,
    total: entries.length,
    exists: entries.filter((e) => e.status === "exists").length,
    planned: entries.filter((e) => e.status === "planned").length,
    orphan: entries.filter((e) => e.status === "orphan").length,
    entries,
  };

  return map;
}

async function main() {
  const map = await generateContentMap();
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(map, null, 2) + "\n", "utf8");
  process.stdout.write(`Wrote ${outPath}\n`);
  process.stdout.write(`exists: ${map.exists}, planned: ${map.planned}, orphan: ${map.orphan}\n`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    process.stderr.write(String(err?.stack || err) + "\n");
    process.exit(1);
  });
}
