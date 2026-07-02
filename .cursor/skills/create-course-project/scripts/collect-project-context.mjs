#!/usr/bin/env node
/**
 * Collect module README, projects overview, and all project READMEs for authoring.
 *
 * Usage:
 *   node collect-project-context.mjs <course-id>
 *   node collect-project-context.mjs --list
 *   node collect-project-context.mjs 01-javascript-fundamentals --format json
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PBL_README_SECTIONS,
  PROJECT_TREE,
  extractObserveLines,
  validateModuleProjectsReadme,
  validateProjectReadme,
  validateProjectTestsJson,
} from "./project-contract.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");
const courseDir = path.join(repoRoot, "course");
const MAX_FILE_BYTES = 200_000;

function stripCursorMarkers(input) {
  return input
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (!t.startsWith("<!--") || !t.endsWith("-->")) return true;
      return !(t.includes("cursor:") || t.includes("marker:"));
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function humanizeTitle(folderName) {
  return folderName
    .replace(/^\d{2,3}-/, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

async function listDirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function readTextSafe(filePath) {
  try {
    const stat = await fs.stat(filePath);
    if (stat.size > MAX_FILE_BYTES) return `[skipped: file exceeds ${MAX_FILE_BYTES} bytes]`;
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function parseArgs(argv) {
  const args = { list: false, format: "markdown", out: null, stripMarkers: true, courseId: null, lesson: null, module: null, course: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--list") args.list = true;
    else if (arg === "--format") args.format = argv[++i] ?? "markdown";
    else if (arg === "--out") args.out = argv[++i] ?? null;
    else if (arg === "--keep-markers") args.stripMarkers = false;
    else if (arg === "--lesson") args.lesson = argv[++i];
    else if (arg === "--module") args.module = argv[++i];
    else if (arg === "--course") args.course = argv[++i];
    else if (!arg.startsWith("-")) args.courseId = arg.replace(/^course\//, "").replace(/\/$/, "");
  }
  return args;
}

async function listCourses() {
  const legacy = (await listDirSafe(courseDir))
    .filter((e) => e.isDirectory() && /^\d{2}-/.test(e.name))
    .map((e) => e.name);
  const hierarchy = [];
  for (const courseEnt of (await listDirSafe(courseDir)).filter((e) => e.isDirectory())) {
    const modulesPath = path.join(courseDir, courseEnt.name, "modules");
    for (const modEnt of (await listDirSafe(modulesPath)).filter((e) => e.isDirectory())) {
      hierarchy.push(`${courseEnt.name}/${modEnt.name}`);
    }
  }
  return [...new Set([...legacy, ...hierarchy])].sort((a, b) => a.localeCompare(b, "en"));
}

async function starterBundleStatus(projectPath) {
  const starterPath = path.join(projectPath, "starter", "index.js");
  const sampleInputPath = path.join(projectPath, "starter", "sample.input");
  const testsJsonPath = path.join(projectPath, "starter", "tests.json");
  const testsRaw = await readTextSafe(testsJsonPath);
  const testsValidation = testsRaw.trim() ? validateProjectTestsJson(testsRaw) : { errors: [], warnings: [] };

  return {
    hasStarter: await fileExists(starterPath),
    hasSampleInput: await fileExists(sampleInputPath),
    hasTestsJson: Boolean(testsRaw.trim()),
    testsValidation,
  };
}

async function discoverLessonProjects(lessonPath, relBase) {
  const projectsRoot = path.join(lessonPath, "projects");
  const projects = [];
  for (const project of (await listDirSafe(projectsRoot)).filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const projectPath = path.join(projectsRoot, project.name);
    const readmePath = path.join(projectPath, "README.md");
    const readme = await readTextSafe(readmePath);
    const starter = await starterBundleStatus(projectPath);
    if (!readme.trim() && !starter.hasStarter) continue;
    projects.push({
      id: project.name,
      title: humanizeTitle(project.name),
      lessonId: path.basename(lessonPath),
      rootPath: path.posix.join(relBase, "projects", project.name),
      readmePath: path.relative(repoRoot, readmePath),
      hasReadme: Boolean(readme.trim()),
      ...starter,
      validation: validateProjectReadme(readme),
    });
  }
  return projects;
}

async function discoverProjects(modulePath, courseId) {
  const projectsRoot = path.join(modulePath, "projects");
  const topics = [];
  const topicEntries = (await listDirSafe(projectsRoot)).filter((e) => e.isDirectory());

  for (const topic of topicEntries.sort((a, b) => a.name.localeCompare(b.name))) {
    const topicPath = path.join(projectsRoot, topic.name);
    const projectEntries = (await listDirSafe(topicPath)).filter((e) => e.isDirectory());
    const projects = [];

    for (const project of projectEntries.sort((a, b) => a.name.localeCompare(b.name))) {
      const projectPath = path.join(topicPath, project.name);
      const readmePath = path.join(projectPath, "README.md");
      const readme = await readTextSafe(readmePath);
      const validation = validateProjectReadme(readme);
      const starter = await starterBundleStatus(projectPath);

      projects.push({
        id: project.name,
        title: humanizeTitle(project.name),
        topicDir: topic.name,
        rootPath: path.posix.join("course", courseId, "projects", topic.name, project.name),
        readmePath: path.relative(repoRoot, readmePath),
        hasReadme: Boolean(readme.trim()),
        hasSolutionDir: await dirExists(path.join(projectPath, "solution")),
        ...starter,
        validation,
      });
    }

    topics.push({ topicDir: topic.name, title: humanizeTitle(topic.name), projects });
  }

  return topics;
}

async function fileExists(p) {
  try {
    const stat = await fs.stat(p);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function dirExists(p) {
  try {
    const stat = await fs.stat(p);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function collectCourse(courseId, stripMarkers) {
  const modulePath = path.join(courseDir, courseId);
  const moduleReadme = await readTextSafe(path.join(modulePath, "README.md"));
  const projectsReadmePath = path.join(modulePath, "projects", "README.md");
  const projectsReadme = await readTextSafe(projectsReadmePath);
  const topics = await discoverProjects(modulePath, courseId);

  const clean = (text) => (stripMarkers ? stripCursorMarkers(text) : text.trim());

  return {
    courseId,
    moduleReadme: clean(moduleReadme),
    projectsReadme: clean(projectsReadme),
    projectsReadmePath: path.relative(repoRoot, projectsReadmePath),
    projectsReadmeValidation: validateModuleProjectsReadme(projectsReadme),
    topics,
    contract: {
      tree: PROJECT_TREE,
      pblSections: PBL_README_SECTIONS,
    },
  };
}

function extractLessonSection(markdown, heading) {
  const block = markdown.match(new RegExp(`^##\\s+${heading}\\s*[\\r\\n]+([\\s\\S]*?)(?=^##\\s|\\Z)`, "im"));
  return block ? block[1].trim() : "";
}

function formatMarkdown(ctx) {
  const lines = [
    `# Project context — ${ctx.courseId}`,
    "",
  ];

  if (ctx.lessonReadme) {
    lines.push("## Lesson README — Predict first", "", extractLessonSection(ctx.lessonReadme, "Predict first") || "_none_", "");
    lines.push("## Lesson README — What to observe", "", extractLessonSection(ctx.lessonReadme, "What to observe") || extractObserveLines(ctx.lessonReadme).map((l) => `- ${l}`).join("\n") || "_none_", "");
    lines.push("## Lesson README (excerpt)", "", ctx.lessonReadme.slice(0, 4000) || "_empty_", "");
  }

  lines.push(
    "## Canonical structure",
    "",
    "```text",
    "course/<NN-module>/projects/README.md",
    "  <NN-topic>/",
    "    <NNN-project>/",
    "      README.md",
    "      starter/index.js",
    "      starter/tests.json",
    "      starter/sample.input",
    "      solution/          (optional)",
    "      project-delivery.json  (student writes via UI)",
    "```",
    "",
    "## PBL README sections (English)",
    "",
    ...ctx.contract.pblSections.map((s) => `- ${s}`),
    "",
    "## Module README (excerpt)",
    "",
    ctx.moduleReadme.slice(0, 4000) || "_empty_",
    "",
    "## projects/README.md validation",
    "",
    `- Errors: ${ctx.projectsReadmeValidation.errors.length ? ctx.projectsReadmeValidation.errors.join("; ") : "none"}`,
    `- Warnings: ${ctx.projectsReadmeValidation.warnings.length ? ctx.projectsReadmeValidation.warnings.join("; ") : "none"}`,
    "",
    "## projects/README.md (current)",
    "",
    ctx.projectsReadme || "_missing_",
    "",
    "## Existing projects",
    "",
  );

  for (const topic of ctx.topics) {
    lines.push(`### ${topic.topicDir}/ — ${topic.title}`);
    lines.push("");
    if (topic.projects.length === 0) {
      lines.push("_No projects yet._");
      lines.push("");
      continue;
    }
    for (const project of topic.projects) {
      const flags = [
        project.hasReadme ? "readme" : "NO-readme",
        project.hasStarter ? "starter" : "NO-starter",
        project.hasTestsJson ? "tests.json" : "NO-tests.json",
        project.hasSampleInput ? "sample.input" : "NO-sample.input",
        project.hasSolutionDir ? "solution/" : "no-solution",
      ].join(", ");
      const issues = [
        ...project.validation.errors.map((e) => `ERROR: ${e}`),
        ...project.validation.warnings.map((w) => `WARN: ${w}`),
        ...(project.testsValidation?.errors ?? []).map((e) => `ERROR tests.json: ${e}`),
        ...(project.testsValidation?.warnings ?? []).map((w) => `WARN tests.json: ${w}`),
      ];
      lines.push(`- **${project.id}** (${flags}) — \`${project.rootPath}\``);
      if (issues.length) lines.push(`  - ${issues.join("; ")}`);
    }
    lines.push("");
  }

  lines.push("## Gold-standard reference");
  lines.push("");
  lines.push(
    "- Project README: `course/02-objects-references-and-copying/projects/01-data-shaping-and-safety/001-safe-normalizer/README.md`",
  );
  lines.push(
    "- Runnable starter bundle: same folder `starter/index.js`, `starter/tests.json`, `starter/sample.input`",
  );
  lines.push("");

  return lines.join("\n");
}

async function collectLesson(courseSlug, moduleId, lessonId, stripMarkers) {
  const lessonPath = path.join(courseDir, courseSlug, "modules", moduleId, "lessons", lessonId);
  const relBase = path.posix.join("course", courseSlug, "modules", moduleId, "lessons", lessonId);
  const lessonReadme = await readTextSafe(path.join(lessonPath, "README.md"));
  const moduleReadme = await readTextSafe(path.join(courseDir, courseSlug, "modules", moduleId, "README.md"));
  const projects = await discoverLessonProjects(lessonPath, relBase);
  const clean = (text) => (stripMarkers ? stripCursorMarkers(text) : text.trim());
  return {
    courseSlug,
    moduleId,
    lessonId,
    lessonReadme: clean(lessonReadme),
    moduleReadme: clean(moduleReadme),
    projects,
    contract: { tree: PROJECT_TREE, pblSections: PBL_README_SECTIONS },
  };
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.list) {
    const courses = await listCourses();
    process.stdout.write(`${courses.join("\n")}\n`);
    return;
  }

  if (args.lesson && args.module && args.course) {
    const ctx = await collectLesson(args.course, args.module, args.lesson, args.stripMarkers);
    const output = args.format === "json" ? JSON.stringify(ctx, null, 2) : formatMarkdown({ courseId: `${args.course}/${args.module}/${args.lesson}`, ...ctx, topics: [{ topicDir: "lesson", title: args.lesson, projects: ctx.projects }], moduleReadme: ctx.moduleReadme, projectsReadme: "", projectsReadmeValidation: { errors: [], warnings: [] } });
    if (args.out) await fs.writeFile(path.resolve(args.out), output, "utf8");
    else process.stdout.write(`${output}\n`);
    return;
  }

  if (!args.courseId) {
    process.stderr.write("Usage: node collect-project-context.mjs <course-id> | --course <slug> --module <id> --lesson <id> | --list\n");
    process.exit(2);
  }

  const ctx = await collectCourse(args.courseId, args.stripMarkers);
  const output = args.format === "json" ? JSON.stringify(ctx, null, 2) : formatMarkdown(ctx);

  if (args.out) {
    await fs.writeFile(path.resolve(args.out), output, "utf8");
    process.stderr.write(`Wrote ${args.out}\n`);
  } else {
    process.stdout.write(`${output}\n`);
  }
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
