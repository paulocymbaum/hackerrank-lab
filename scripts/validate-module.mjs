#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { validateLessonAtPath } from "./validate-lesson.mjs";

const require = createRequire(import.meta.url);
const { loadGraph, findNodeByIndex } = require("./graph/graph-index.js");

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
  const args = { all: false, course: null, module: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all") args.all = true;
    else if (arg === "--course") args.course = argv[++i];
    else if (arg === "--module") args.module = argv[++i];
  }
  return args;
}

export async function validateModuleAtPath(modulePath, graph) {
  const findings = [];
  const rel = path.relative(repoRoot, modulePath);

  const readme = await readTextSafe(path.join(modulePath, "README.md"));
  if (!readme.trim()) {
    findings.push({ level: "error", path: rel, message: "README.md missing or empty" });
  }

  const meta = await readJsonSafe(path.join(modulePath, "module.meta.json"));
  if (!meta?.id || !meta?.graphIndex || !meta?.title) {
    findings.push({ level: "error", path: rel, message: "module.meta.json missing required fields" });
  } else {
    const node = findNodeByIndex(graph, meta.graphIndex);
    if (!node) {
      findings.push({ level: "error", path: rel, message: `graphIndex "${meta.graphIndex}" not found in graph` });
    }
  }

  const lessonsPath = path.join(modulePath, "lessons");
  const lessonEntries = (await listDirSafe(lessonsPath)).filter((e) => e.isDirectory());
  if (lessonEntries.length === 0) {
    findings.push({ level: "error", path: rel, message: "No lessons found under lessons/" });
  }

  for (const lessonEnt of lessonEntries) {
    findings.push(...(await validateLessonAtPath(path.join(lessonsPath, lessonEnt.name), graph)));
  }

  return findings;
}

async function listModules(courseFilter, moduleFilter) {
  const modules = [];
  const courseEntries = await listDirSafe(courseDir);

  for (const courseEnt of courseEntries.filter((e) => e.isDirectory())) {
    if (courseFilter && courseEnt.name !== courseFilter) continue;
    const modulesPath = path.join(courseDir, courseEnt.name, "modules");
    const moduleEntries = await listDirSafe(modulesPath);
    for (const modEnt of moduleEntries.filter((e) => e.isDirectory())) {
      if (moduleFilter && modEnt.name !== moduleFilter) continue;
      modules.push(path.join(modulesPath, modEnt.name));
    }
  }
  return modules;
}

async function main() {
  const args = parseArgs(process.argv);
  const graph = loadGraph({ repoRoot });
  let findings = [];

  const modules = await listModules(args.course, args.module);
  if (modules.length === 0) {
    process.stderr.write("No hierarchy modules found. Use --module <id>, --course <slug>, or --all\n");
    process.exit(2);
  }

  for (const modulePath of modules) {
    findings.push(...(await validateModuleAtPath(modulePath, graph)));
  }

  for (const item of findings) {
    const prefix = item.level === "error" ? "ERROR" : "WARN";
    process.stdout.write(`${prefix} ${item.path || "."}: ${item.message}\n`);
  }

  const errors = findings.filter((f) => f.level === "error").length;
  process.stdout.write(`\nSummary: ${errors} error(s)\n`);
  process.exit(errors > 0 ? 1 : 0);
}

if (process.argv[1]?.endsWith("validate-module.mjs")) {
  main().catch((err) => {
    process.stderr.write(String(err?.stack || err) + "\n");
    process.exit(1);
  });
}
