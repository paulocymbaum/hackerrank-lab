#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const { loadGraph, findNodeByIndex, isLeafNode } = require("./graph/graph-index.js");

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const courseDir = path.join(repoRoot, "course");

async function listDirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function readTextSafe(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function readJsonSafe(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

function parseArgs(argv) {
  const args = { all: false, course: null, module: null, lesson: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all") args.all = true;
    else if (arg === "--course") args.course = argv[++i];
    else if (arg === "--module") args.module = argv[++i];
    else if (arg === "--lesson") args.lesson = argv[++i];
  }
  return args;
}

function validateLessonMeta(meta, graph) {
  const findings = [];
  if (!meta || typeof meta !== "object") {
    findings.push({ level: "error", message: "lesson.meta.json missing or invalid" });
    return findings;
  }
  if (!meta.id || !meta.graphIndex || !meta.graphNodeId || !meta.title) {
    findings.push({ level: "error", message: "lesson.meta.json missing required fields (id, graphIndex, graphNodeId, title)" });
  }
  const node = findNodeByIndex(graph, meta.graphIndex);
  if (!node) {
    findings.push({ level: "error", message: `graphIndex "${meta.graphIndex}" not found in graph` });
  } else if (!isLeafNode(graph, node.id)) {
    findings.push({ level: "error", message: `graphIndex "${meta.graphIndex}" is not a leaf node` });
  }
  return findings;
}

async function validateLessonProjects(lessonPath) {
  const findings = [];
  const projectsRoot = path.join(lessonPath, "projects");
  try {
    await fs.access(projectsRoot);
  } catch {
    return findings;
  }

  const validateScript = path.join(repoRoot, ".cursor/skills/create-course-project/scripts/validate-project.mjs");
  const rel = path.relative(repoRoot, projectsRoot);
  try {
    execFileSync("node", [validateScript, `course/${rel.replace(/^course\//, "")}`], {
      cwd: repoRoot,
      stdio: "pipe",
      encoding: "utf8",
    });
  } catch (err) {
    const output = `${err.stdout || ""}${err.stderr || ""}`;
    for (const line of output.split("\n").filter((l) => l.startsWith("ERROR"))) {
      findings.push({ level: "error", message: line.replace(/^ERROR\s+/, "") });
    }
  }
  return findings;
}

async function validateLessonQuizzes(lessonPath) {
  const findings = [];
  const quizDir = path.join(lessonPath, "quiz");
  const entries = await listDirSafe(quizDir);
  const quizFiles = entries.filter((e) => e.isFile() && e.name.endsWith(".json") && e.name !== "score.json");

  if (quizFiles.length === 0) return findings;

  const validateScript = path.join(repoRoot, ".cursor/skills/create-course-quiz/scripts/validate-quiz.mjs");
  for (const file of quizFiles) {
    const abs = path.join(quizDir, file.name);
    try {
      execFileSync("node", [validateScript, abs], { cwd: repoRoot, stdio: "pipe" });
    } catch (err) {
      findings.push({ level: "error", message: `Invalid quiz ${file.name}: ${err.stderr || err.message}` });
    }
  }
  return findings;
}

export async function validateLessonAtPath(lessonPath, graph, options = {}) {
  const findings = [];
  const rel = path.relative(repoRoot, lessonPath);

  const readme = await readTextSafe(path.join(lessonPath, "README.md"));
  if (!readme.trim()) {
    findings.push({ level: "error", path: rel, message: "README.md missing or empty" });
  }

  const meta = await readJsonSafe(path.join(lessonPath, "lesson.meta.json"));
  for (const f of validateLessonMeta(meta, graph)) {
    findings.push({ level: f.level, path: rel, message: f.message });
  }

  if (!options.skipNested) {
    for (const f of await validateLessonProjects(lessonPath)) {
      findings.push({ level: f.level, path: rel, message: f.message });
    }
    for (const f of await validateLessonQuizzes(lessonPath)) {
      findings.push({ level: f.level, path: rel, message: f.message });
    }
  }

  return findings;
}

async function listHierarchyLessons(courseFilter, moduleFilter) {
  const lessons = [];
  const courseEntries = await listDirSafe(courseDir);

  for (const courseEnt of courseEntries.filter((e) => e.isDirectory())) {
    if (courseFilter && courseEnt.name !== courseFilter) continue;
    const modulesPath = path.join(courseDir, courseEnt.name, "modules");
    const moduleEntries = await listDirSafe(modulesPath);

    for (const modEnt of moduleEntries.filter((e) => e.isDirectory())) {
      if (moduleFilter && modEnt.name !== moduleFilter) continue;
      const lessonsPath = path.join(modulesPath, modEnt.name, "lessons");
      const lessonEntries = await listDirSafe(lessonsPath);
      for (const lessonEnt of lessonEntries.filter((e) => e.isDirectory())) {
        lessons.push(path.join(lessonsPath, lessonEnt.name));
      }
    }
  }
  return lessons;
}

async function checkDuplicateGraphIndexes(lessonPaths) {
  const findings = [];
  const byModule = new Map();

  for (const lessonPath of lessonPaths) {
    const meta = await readJsonSafe(path.join(lessonPath, "lesson.meta.json"));
    if (!meta?.graphIndex) continue;
    const modulePath = path.dirname(path.dirname(lessonPath));
    if (!byModule.has(modulePath)) byModule.set(modulePath, new Map());
    const moduleMap = byModule.get(modulePath);
    if (moduleMap.has(meta.graphIndex)) {
      findings.push({
        level: "error",
        path: path.relative(repoRoot, lessonPath),
        message: `Duplicate graphIndex "${meta.graphIndex}" in module`,
      });
    } else {
      moduleMap.set(meta.graphIndex, lessonPath);
    }
  }
  return findings;
}

async function main() {
  const args = parseArgs(process.argv);
  const graph = loadGraph({ repoRoot });
  const findings = [];

  if (args.lesson) {
    const abs = path.isAbsolute(args.lesson) ? args.lesson : path.join(repoRoot, args.lesson);
    findings.push(...(await validateLessonAtPath(abs, graph)));
  } else {
    const lessonPaths = await listHierarchyLessons(args.course, args.module);
    if (lessonPaths.length === 0 && !args.all) {
      process.stderr.write("No lessons found. Use --lesson <path>, --module <id>, --course <slug>, or --all\n");
      process.exit(2);
    }
    findings.push(...(await checkDuplicateGraphIndexes(lessonPaths)));
    for (const lessonPath of lessonPaths) {
      findings.push(...(await validateLessonAtPath(lessonPath, graph)));
    }
  }

  for (const item of findings) {
    const prefix = item.level === "error" ? "ERROR" : "WARN";
    process.stdout.write(`${prefix} ${item.path || "."}: ${item.message}\n`);
  }

  const errors = findings.filter((f) => f.level === "error").length;
  process.stdout.write(`\nSummary: ${errors} error(s)\n`);
  process.exit(errors > 0 ? 1 : 0);
}

if (process.argv[1]?.endsWith("validate-lesson.mjs")) {
  main().catch((err) => {
    process.stderr.write(String(err?.stack || err) + "\n");
    process.exit(1);
  });
}
