#!/usr/bin/env node
/**
 * Collect course README, example lessons, and existing quizzes for quiz authoring.
 *
 * Usage:
 *   node collect-course-context.mjs <course-id>
 *   node collect-course-context.mjs --list
 *   node collect-course-context.mjs 01-javascript-fundamentals --format json
 *   node collect-course-context.mjs 01-javascript-fundamentals --out context.md
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

function humanizeCourseTitle(folderName) {
  const title = folderName
    .replace(/^\d{2}-/, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
  const n = folderName.match(/^(\d{2})-/);
  return n ? `${n[1]} — ${title}` : title;
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
  const args = { list: false, format: "markdown", out: null, stripMarkers: true, courseId: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--list") args.list = true;
    else if (arg === "--format") args.format = argv[++i] ?? "markdown";
    else if (arg === "--out") args.out = argv[++i] ?? null;
    else if (arg === "--keep-markers") args.stripMarkers = false;
    else if (!arg.startsWith("-")) args.courseId = arg.replace(/^course\//, "").replace(/\/$/, "");
  }
  return args;
}

async function listCourses() {
  const entries = await listDirSafe(courseDir);
  return entries
    .filter((e) => e.isDirectory() && /^\d{2}-/.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
}

async function collectCourseContext(courseId, stripMarkers) {
  const moduleDir = path.join(courseDir, courseId);
  try {
    const stat = await fs.stat(moduleDir);
    if (!stat.isDirectory()) throw new Error("not a directory");
  } catch {
    throw new Error(`Course not found: ${courseId}`);
  }

  const readmeRaw = await readTextSafe(path.join(moduleDir, "README.md"));
  const readme = stripMarkers ? stripCursorMarkers(readmeRaw) : readmeRaw.trim();

  const examplesDir = path.join(moduleDir, "examples");
  const exampleFiles = (await listDirSafe(examplesDir))
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  const examples = [];
  for (const fileName of exampleFiles) {
    const rel = path.posix.join("course", courseId, "examples", fileName);
    const raw = await readTextSafe(path.join(examplesDir, fileName));
    examples.push({
      fileName,
      path: rel,
      markdown: stripMarkers ? stripCursorMarkers(raw) : raw.trim(),
    });
  }

  const quizDir = path.join(moduleDir, "quiz");
  const quizFiles = (await listDirSafe(quizDir))
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  const existingQuizzes = [];
  for (const fileName of quizFiles) {
    const abs = path.join(quizDir, fileName);
    const raw = await readTextSafe(abs);
    let meta = { fileName, path: path.posix.join("course", courseId, "quiz", fileName), questionCount: 0, id: null, title: null };
    try {
      const parsed = JSON.parse(raw);
      meta.id = parsed.id ?? null;
      meta.title = parsed.title ?? null;
      meta.questionCount = Array.isArray(parsed.questions) ? parsed.questions.length : 0;
    } catch {
      meta.parseError = true;
    }
    existingQuizzes.push(meta);
  }

  return {
    courseId,
    title: humanizeCourseTitle(courseId),
    readmePath: path.posix.join("course", courseId, "README.md"),
    readme,
    examples,
    existingQuizzes,
    suggestedQuizDir: path.posix.join("course", courseId, "quiz"),
  };
}

function toMarkdown(ctx) {
  const lines = [
    `# Course context: ${ctx.courseId}`,
    "",
    `**Title:** ${ctx.title}`,
    `**Quiz output dir:** \`${ctx.suggestedQuizDir}/\``,
    "",
    "## README",
    "",
    ctx.readme || "_No README.md content._",
    "",
    "## Examples",
    "",
  ];

  if (ctx.examples.length === 0) {
    lines.push("_No example lessons._", "");
  } else {
    for (const ex of ctx.examples) {
      lines.push(`### ${ex.fileName}`, "", `Path: \`${ex.path}\``, "", ex.markdown || "_Empty._", "", "---", "");
    }
  }

  lines.push("## Existing quizzes", "");
  if (ctx.existingQuizzes.length === 0) {
    lines.push("_None yet._", "");
  } else {
    for (const q of ctx.existingQuizzes) {
      const label = q.title ? `${q.title} (\`${q.id}\`)` : q.fileName;
      lines.push(`- ${label} — ${q.questionCount} questions — \`${q.path}\`${q.parseError ? " _(invalid JSON)_" : ""}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.list) {
    const courses = await listCourses();
    console.log(courses.join("\n"));
    return;
  }

  if (!args.courseId) {
    console.error("Usage: collect-course-context.mjs <course-id> | --list");
    console.error("Example: collect-course-context.mjs 01-javascript-fundamentals");
    process.exitCode = 1;
    return;
  }

  const ctx = await collectCourseContext(args.courseId, args.stripMarkers);
  const output = args.format === "json" ? JSON.stringify(ctx, null, 2) : toMarkdown(ctx);

  if (args.out) {
    await fs.mkdir(path.dirname(path.resolve(args.out)), { recursive: true });
    await fs.writeFile(path.resolve(args.out), output, "utf8");
    console.error(`Wrote ${args.out}`);
  } else {
    console.log(output);
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exitCode = 1;
});
