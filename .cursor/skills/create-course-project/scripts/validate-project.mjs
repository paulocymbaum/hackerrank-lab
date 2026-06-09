#!/usr/bin/env node
/**
 * Validate PBL project structure under course/<module>/projects/.
 *
 * Usage:
 *   node validate-project.mjs course/<module-id>
 *   node validate-project.mjs course/<module-id>/projects/<topic>/<project>
 *   node validate-project.mjs --all
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateModuleProjectsReadme,
  validateProjectReadme,
} from "./project-contract.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");
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

async function fileExists(p) {
  try {
    return (await fs.stat(p)).isFile();
  } catch {
    return false;
  }
}

function parseArgs(argv) {
  const args = { all: false, targets: [] };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all") args.all = true;
    else if (!arg.startsWith("-")) args.targets.push(arg.replace(/^course\//, ""));
  }
  return args;
}

async function listModules() {
  const entries = await listDirSafe(courseDir);
  return entries
    .filter((e) => e.isDirectory() && /^\d{2}-/.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, "en"));
}

async function validateModuleProjectsReadmeFile(modulePath, relBase) {
  const readmePath = path.join(modulePath, "projects", "README.md");
  const markdown = await readTextSafe(readmePath);
  const result = validateModuleProjectsReadme(markdown);
  const rel = path.relative(repoRoot, readmePath);

  if (!markdown.trim()) {
    return [{ level: "error", path: rel, message: "projects/README.md is missing or empty" }];
  }

  return [
    ...result.errors.map((message) => ({ level: "error", path: rel, message })),
    ...result.warnings.map((message) => ({ level: "warn", path: rel, message })),
  ];
}

async function validateSingleProject(projectPath) {
  const findings = [];
  const rel = path.relative(repoRoot, projectPath);
  const readmePath = path.join(projectPath, "README.md");
  const starterPath = path.join(projectPath, "starter", "index.js");
  const markdown = await readTextSafe(readmePath);

  if (!markdown.trim()) {
    findings.push({ level: "error", path: rel, message: "Missing or empty README.md (invisible in UI)" });
    return findings;
  }

  const readmeCheck = validateProjectReadme(markdown);
  for (const message of readmeCheck.errors) {
    findings.push({ level: "error", path: path.relative(repoRoot, readmePath), message });
  }
  for (const message of readmeCheck.warnings) {
    findings.push({ level: "warn", path: path.relative(repoRoot, readmePath), message });
  }

  if (!(await fileExists(starterPath))) {
    findings.push({
      level: "warn",
      path: path.relative(repoRoot, starterPath),
      message: "Missing starter/index.js (project not runnable)",
    });
  }

  return findings;
}

async function validateModule(moduleId) {
  const modulePath = path.join(courseDir, moduleId);
  const findings = await validateModuleProjectsReadmeFile(modulePath, moduleId);

  const projectsRoot = path.join(modulePath, "projects");
  const topics = (await listDirSafe(projectsRoot)).filter((e) => e.isDirectory());

  for (const topic of topics) {
    const topicPath = path.join(projectsRoot, topic.name);
    const projects = (await listDirSafe(topicPath)).filter((e) => e.isDirectory());
    for (const project of projects) {
      findings.push(...(await validateSingleProject(path.join(topicPath, project.name))));
    }
  }

  return findings;
}

async function resolveTarget(target) {
  const abs = path.resolve(repoRoot, "course", target);
  const relFromCourse = path.relative(courseDir, abs);

  if (relFromCourse.startsWith("..")) return null;

  const parts = relFromCourse.split(path.sep).filter(Boolean);
  if (parts.length === 1) return { kind: "module", moduleId: parts[0] };
  if (parts.length >= 3 && parts[1] === "projects") {
    return { kind: "project", projectPath: abs };
  }
  if (parts.length === 2 && parts[1] === "projects") {
    return { kind: "module", moduleId: parts[0] };
  }
  return null;
}

async function main() {
  const args = parseArgs(process.argv);
  const findings = [];

  if (args.all) {
    for (const moduleId of await listModules()) {
      findings.push(...(await validateModule(moduleId)));
    }
  } else if (args.targets.length === 0) {
    process.stderr.write(
      "Usage: node validate-project.mjs course/<module> [course/<module>/projects/...] | --all\n",
    );
    process.exit(2);
  } else {
    for (const target of args.targets) {
      const resolved = await resolveTarget(target);
      if (!resolved) {
        findings.push({ level: "error", path: target, message: "Invalid path" });
        continue;
      }
      if (resolved.kind === "module") {
        findings.push(...(await validateModule(resolved.moduleId)));
      } else {
        findings.push(...(await validateSingleProject(resolved.projectPath)));
      }
    }
  }

  for (const item of findings) {
    const prefix = item.level === "error" ? "ERROR" : "WARN";
    process.stdout.write(`${prefix} ${item.path}: ${item.message}\n`);
  }

  const errors = findings.filter((f) => f.level === "error").length;
  const warns = findings.filter((f) => f.level === "warn").length;
  process.stdout.write(`\nSummary: ${errors} error(s), ${warns} warning(s)\n`);
  process.exit(errors > 0 ? 1 : 0);
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
