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
  validateLessonProjectAlignment,
  validateModuleProjectsReadme,
  validateProjectReadme,
  validateProjectTestsJson,
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
  const legacy = (await listDirSafe(courseDir))
    .filter((e) => e.isDirectory() && /^\d{2}-/.test(e.name))
    .map((e) => ({ id: e.name, path: path.join(courseDir, e.name), kind: "legacy" }));

  const hierarchy = [];
  for (const courseEnt of (await listDirSafe(courseDir)).filter((e) => e.isDirectory())) {
    const modulesPath = path.join(courseDir, courseEnt.name, "modules");
    for (const modEnt of (await listDirSafe(modulesPath)).filter((e) => e.isDirectory())) {
      hierarchy.push({ id: modEnt.name, path: path.join(modulesPath, modEnt.name), kind: "hierarchy" });
    }
  }

  return [...hierarchy, ...legacy].sort((a, b) => a.id.localeCompare(b.id, "en"));
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

async function findLessonReadmeForProject(projectPath) {
  const parts = projectPath.split(path.sep);
  const lessonsIdx = parts.lastIndexOf("lessons");
  const projectsIdx = parts.lastIndexOf("projects");
  if (lessonsIdx < 0 || projectsIdx < 0 || projectsIdx <= lessonsIdx) return null;
  const lessonPath = parts.slice(0, projectsIdx).join(path.sep);
  const lessonReadme = path.join(lessonPath, "README.md");
  if (await fileExists(lessonReadme)) return lessonReadme;
  return null;
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

  const lessonReadmePath = await findLessonReadmeForProject(projectPath);
  if (lessonReadmePath) {
    const lessonMarkdown = await readTextSafe(lessonReadmePath);
    const alignment = validateLessonProjectAlignment(lessonMarkdown, markdown);
    for (const message of alignment.errors) {
      findings.push({ level: "error", path: path.relative(repoRoot, readmePath), message });
    }
    for (const message of alignment.warnings) {
      findings.push({ level: "warn", path: path.relative(repoRoot, readmePath), message });
    }
  }

  if (!(await fileExists(starterPath))) {
    findings.push({
      level: "warn",
      path: path.relative(repoRoot, starterPath),
      message: "Missing starter/index.js (project not runnable)",
    });
  }

  const sampleInputPath = path.join(projectPath, "starter", "sample.input");
  if (!(await fileExists(sampleInputPath))) {
    findings.push({
      level: "warn",
      path: path.relative(repoRoot, sampleInputPath),
      message: "Missing starter/sample.input (example stdin for manual CLI)",
    });
  }

  const testsJsonPath = path.join(projectPath, "starter", "tests.json");
  const testsRaw = await readTextSafe(testsJsonPath);
  if (!testsRaw.trim()) {
    findings.push({
      level: "warn",
      path: path.relative(repoRoot, testsJsonPath),
      message: "Missing starter/tests.json (Run answer matrix unavailable in UI)",
    });
  } else {
    const testsCheck = validateProjectTestsJson(testsRaw);
    for (const message of testsCheck.errors) {
      findings.push({ level: "error", path: path.relative(repoRoot, testsJsonPath), message });
    }
    for (const message of testsCheck.warnings) {
      findings.push({ level: "warn", path: path.relative(repoRoot, testsJsonPath), message });
    }
  }

  return findings;
}

async function validateProjectsInRoot(projectsRoot) {
  const findings = [];
  const entries = (await listDirSafe(projectsRoot)).filter((e) => e.isDirectory());

  for (const entry of entries) {
    const entryPath = path.join(projectsRoot, entry.name);
    const starter = path.join(entryPath, "starter", "index.js");
    if (await fileExists(path.join(entryPath, "README.md")) || (await fileExists(starter))) {
      findings.push(...(await validateSingleProject(entryPath)));
      continue;
    }
    const nested = (await listDirSafe(entryPath)).filter((e) => e.isDirectory());
    for (const project of nested) {
      findings.push(...(await validateSingleProject(path.join(entryPath, project.name))));
    }
  }
  return findings;
}

async function validateModule(moduleRef) {
  const modulePath = typeof moduleRef === "string" ? path.join(courseDir, moduleRef) : moduleRef.path;
  const moduleId = typeof moduleRef === "string" ? moduleRef : moduleRef.id;
  const findings = [];

  const moduleProjectsReadme = path.join(modulePath, "projects", "README.md");
  if (await fileExists(moduleProjectsReadme)) {
    findings.push(...(await validateModuleProjectsReadmeFile(modulePath, moduleId)));
    findings.push(...(await validateProjectsInRoot(path.join(modulePath, "projects"))));
  }

  const lessonsPath = path.join(modulePath, "lessons");
  for (const lessonEnt of (await listDirSafe(lessonsPath)).filter((e) => e.isDirectory())) {
    const lessonProjects = path.join(lessonsPath, lessonEnt.name, "projects");
    if (await fileExists(lessonProjects)) {
      findings.push(...(await validateProjectsInRoot(lessonProjects)));
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
  if (parts.includes("lessons") && parts.includes("projects")) {
    const projectsIdx = parts.lastIndexOf("projects");
    if (projectsIdx < parts.length - 1) {
      return { kind: "project", projectPath: abs };
    }
    return { kind: "lesson-projects", projectPath: abs };
  }
  return null;
}

async function main() {
  const args = parseArgs(process.argv);
  const findings = [];

  if (args.all) {
    for (const moduleRef of await listModules()) {
      findings.push(...(await validateModule(moduleRef)));
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
      } else if (resolved.kind === "lesson-projects") {
        findings.push(...(await validateProjectsInRoot(resolved.projectPath)));
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
