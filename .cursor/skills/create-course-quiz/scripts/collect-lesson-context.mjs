#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadGraph, findNodeByIndex } = require("../../../../scripts/graph/graph-index.js");

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");
const courseDir = path.join(repoRoot, "course");
const MAX_FILE_BYTES = 200_000;

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
  const args = { list: false, format: "markdown", out: null, course: null, module: null, lesson: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--list") args.list = true;
    else if (arg === "--format") args.format = argv[++i] ?? "markdown";
    else if (arg === "--out") args.out = argv[++i] ?? null;
    else if (arg === "--course") args.course = argv[++i];
    else if (arg === "--module") args.module = argv[++i];
    else if (!arg.startsWith("-") && !args.lesson) args.lesson = arg;
  }
  return args;
}

async function listLessons() {
  const lessons = [];
  const courseEntries = await listDirSafe(courseDir);
  for (const courseEnt of courseEntries.filter((e) => e.isDirectory())) {
    const modulesPath = path.join(courseDir, courseEnt.name, "modules");
    for (const modEnt of (await listDirSafe(modulesPath)).filter((e) => e.isDirectory())) {
      const lessonsPath = path.join(modulesPath, modEnt.name, "lessons");
      for (const lessonEnt of (await listDirSafe(lessonsPath)).filter((e) => e.isDirectory())) {
        lessons.push({
          courseId: courseEnt.name,
          moduleId: modEnt.name,
          lessonId: lessonEnt.name,
          path: path.join("course", courseEnt.name, "modules", modEnt.name, "lessons", lessonEnt.name),
        });
      }
    }
  }
  return lessons.sort((a, b) => a.path.localeCompare(b.path));
}

async function resolveLessonPath(args) {
  if (args.lesson && args.lesson.includes("/")) {
    return path.join(repoRoot, args.lesson.replace(/^course\//, "course/"));
  }
  const lessons = await listLessons();
  const match = lessons.find((l) => {
    if (args.course && l.courseId !== args.course) return false;
    if (args.module && l.moduleId !== args.module) return false;
    return l.lessonId === args.lesson || l.path.endsWith(`/${args.lesson}`);
  });
  return match ? path.join(repoRoot, match.path) : null;
}

async function collectLessonContext(lessonPath) {
  const graph = loadGraph({ repoRoot });
  const rel = path.relative(repoRoot, lessonPath);
  const parts = rel.split(path.sep);
  const courseId = parts[1];
  const moduleId = parts[3];
  const lessonId = parts[5];

  const lessonMeta = JSON.parse(await readTextSafe(path.join(lessonPath, "lesson.meta.json")) || "{}");
  const moduleReadme = await readTextSafe(path.join(repoRoot, "course", courseId, "modules", moduleId, "README.md"));
  const lessonReadme = await readTextSafe(path.join(lessonPath, "README.md"));

  const prerequisites = (lessonMeta.prerequisites || []).map((idx) => {
    const node = findNodeByIndex(graph, idx);
    return { graphIndex: idx, label: node?.label ?? idx };
  });

  const quizDir = path.join(lessonPath, "quiz");
  const existingQuizzes = [];
  for (const ent of await listDirSafe(quizDir)) {
    if (!ent.isFile() || !ent.name.endsWith(".json") || ent.name === "score.json") continue;
    const raw = await readTextSafe(path.join(quizDir, ent.name));
    try {
      const parsed = JSON.parse(raw);
      existingQuizzes.push({ file: ent.name, id: parsed.id, title: parsed.title, questionCount: parsed.questions?.length ?? 0 });
    } catch {
      existingQuizzes.push({ file: ent.name, id: null, title: null, questionCount: 0 });
    }
  }

  return {
    courseId,
    moduleId,
    lessonId,
    lessonPath: rel,
    lessonMeta,
    prerequisites,
    moduleReadme,
    lessonReadme,
    existingQuizzes,
  };
}

function formatMarkdown(ctx) {
  return [
    `# Lesson context: ${ctx.lessonId}`,
    "",
    `- Course: \`${ctx.courseId}\``,
    `- Module: \`${ctx.moduleId}\``,
    `- Graph index: \`${ctx.lessonMeta.graphIndex ?? "?"}\``,
    "",
    "## Prerequisites",
    ...(ctx.prerequisites.length ? ctx.prerequisites.map((p) => `- ${p.graphIndex}: ${p.label}`) : ["- (none)"]),
    "",
    "## Existing quizzes",
    ...(ctx.existingQuizzes.length
      ? ctx.existingQuizzes.map((q) => `- ${q.file}: ${q.title ?? "?"} (${q.questionCount} questions)`)
      : ["- (none)"]),
    "",
    "## Module README (context)",
    "",
    ctx.moduleReadme || "(empty)",
    "",
    "## Lesson README (source of truth)",
    "",
    ctx.lessonReadme || "(empty)",
    "",
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.list) {
    const lessons = await listLessons();
    console.log(lessons.map((l) => `${l.courseId}/${l.moduleId}/${l.lessonId}`).join("\n"));
    return;
  }

  if (!args.lesson) {
    console.error("Usage: collect-lesson-context.mjs <lesson-id> [--course <slug>] [--module <id>] [--list]");
    process.exit(2);
  }

  const lessonPath = await resolveLessonPath(args);
  if (!lessonPath) {
    console.error(`Lesson not found: ${args.lesson}`);
    process.exit(1);
  }

  const ctx = await collectLessonContext(lessonPath);
  const output = args.format === "json" ? JSON.stringify(ctx, null, 2) : formatMarkdown(ctx);

  if (args.out) {
    await fs.writeFile(args.out, output + "\n", "utf8");
    console.log(`Wrote ${args.out}`);
  } else {
    process.stdout.write(output + "\n");
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
