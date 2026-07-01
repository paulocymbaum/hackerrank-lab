import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const courseDir = path.join(repoRoot, "course");

const MAX_FILE_BYTES = 200_000;
const TEXT_EXTENSIONS = new Set([
  ".md", ".txt", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json", ".css", ".html", ".yml", ".yaml", ".input",
]);

function isProbablyLegacyModuleFolder(name) {
  return /^\d{2}-/.test(name);
}

function leadingNumberPrefix(value) {
  const match = value.match(/^(\d{2})-/);
  return match ? match[1] : null;
}

function humanizeTitle(value, digitPattern) {
  const n = value.match(digitPattern)?.[1] ?? null;
  const title = value
    .replace(digitPattern, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
  return n ? `${n}. ${title}` : title;
}

function humanizeCourseTitle(folderName) {
  const n = leadingNumberPrefix(folderName);
  const title = folderName.replace(/^\d{2}-/, "").split("-").filter(Boolean).map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
  return n ? `${n} — ${title}` : title;
}

function humanizeLessonTitle(fileName) {
  return humanizeTitle(fileName, /^(\d{2}(?:\.\d+)*|\d{2})-/);
}

function humanizeProjectTitle(folderName) {
  return humanizeTitle(folderName, /^(\d{3})-/);
}

function humanizeQuizTitle(fileName) {
  return humanizeTitle(fileName.replace(/\.json$/i, ""), /^(\d{2})-/);
}

function isValidQuizPayload(value) {
  if (!value || typeof value !== "object") return false;
  if (typeof value.id !== "string" || typeof value.title !== "string") return false;
  if (!Array.isArray(value.questions) || value.questions.length === 0) return false;
  return value.questions.every(
    (q) =>
      q &&
      typeof q.id === "string" &&
      typeof q.prompt === "string" &&
      typeof q.correctOptionId === "string" &&
      Array.isArray(q.options) &&
      q.options.length >= 2 &&
      q.options.every((o) => o && typeof o.id === "string" && typeof o.text === "string"),
  );
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
    if (stat.size > MAX_FILE_BYTES) return "";
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

async function walkProjectRoot(absRootDir) {
  const entries = [];

  async function walk(absDir, relDirPosix) {
    const readmeAbs = path.join(absDir, "README.md");
    const readmeMarkdown = await readTextSafe(readmeAbs);
    entries.push({
      path: relDirPosix,
      kind: "dir",
      ...(readmeMarkdown.trim() ? { readmeMarkdown } : {}),
    });

    const dirents = await listDirSafe(absDir);
    for (const ent of dirents) {
      if (ent.name === "node_modules" || ent.name === "dist" || ent.name === ".git") continue;
      const absChild = path.join(absDir, ent.name);
      const relFromRoot = relDirPosix ? path.posix.join(relDirPosix, ent.name) : ent.name;

      if (ent.isDirectory()) {
        await walk(absChild, relFromRoot);
        continue;
      }
      if (!ent.isFile()) continue;
      if (ent.name.toLowerCase() === "project-delivery.json") continue;

      const ext = path.extname(ent.name).toLowerCase();
      if (!TEXT_EXTENSIONS.has(ext)) {
        entries.push({ path: relFromRoot, kind: "file" });
        continue;
      }
      const content = await readTextSafe(absChild);
      entries.push({ path: relFromRoot, kind: "file", ...(content.trim() ? { content } : {}) });
    }
  }

  await walk(absRootDir, "");
  entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
    return a.path.localeCompare(b.path);
  });
  return entries;
}

async function loadQuizzesFromDir(quizDir, basePathPosix) {
  const quizEntries = await listDirSafe(quizDir);
  const quizzes = [];

  for (const ent of quizEntries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))) {
    if (ent.name.toLowerCase() === "score.json") continue;
    const absPath = path.join(quizDir, ent.name);
    const raw = await readTextSafe(absPath);
    if (!raw.trim()) continue;
    try {
      const parsed = JSON.parse(raw);
      if (!isValidQuizPayload(parsed)) {
        console.warn(`Skipping invalid quiz: ${absPath}`);
        continue;
      }
      quizzes.push({
        id: parsed.id,
        title: parsed.title || humanizeQuizTitle(ent.name),
        description: typeof parsed.description === "string" ? parsed.description : "",
        path: path.posix.join(basePathPosix, ent.name),
        questions: parsed.questions,
        ...(parsed.lessonId ? { lessonId: parsed.lessonId } : {}),
        ...(parsed.graphIndex ? { graphIndex: parsed.graphIndex } : {}),
        ...(parsed.moduleId ? { moduleId: parsed.moduleId } : {}),
      });
    } catch {
      console.warn(`Skipping unreadable quiz JSON: ${absPath}`);
    }
  }
  quizzes.sort((a, b) => a.path.localeCompare(b.path));
  return quizzes;
}

async function loadProjectsFromRoot(projectsRootDir, basePathPosix, context = {}) {
  const projects = [];
  const groupEntries = await listDirSafe(projectsRootDir);

  for (const group of groupEntries.filter((e) => e.isDirectory())) {
    const groupDir = path.join(projectsRootDir, group.name);
    const projectEntries = await listDirSafe(groupDir);
    const hasNestedProjects = projectEntries.some((e) => e.isDirectory() && existsSync(path.join(groupDir, e.name, "README.md")));

    if (hasNestedProjects) {
      for (const projectDirEnt of projectEntries.filter((e) => e.isDirectory())) {
        projects.push(...(await loadSingleProject(groupDir, group.name, projectDirEnt.name, basePathPosix, context)));
      }
    } else {
      projects.push(...(await loadSingleProject(projectsRootDir, "", group.name, basePathPosix, context)));
    }
  }
  return projects;
}

async function loadSingleProject(parentDir, groupName, projectDirName, basePathPosix, context) {
  const projectDir = groupName ? path.join(parentDir, groupName, projectDirName) : path.join(parentDir, projectDirName);
  const projectRootRel = groupName
    ? path.posix.join(basePathPosix, groupName, projectDirName)
    : path.posix.join(basePathPosix, projectDirName);
  const readmeAbs = path.join(projectDir, "README.md");
  const readmeMarkdown = await readTextSafe(readmeAbs);
  if (!readmeMarkdown.trim()) return [];

  const entries = await walkProjectRoot(projectDir);
  return [{
    id: projectDirName,
    title: humanizeProjectTitle(projectDirName),
    rootPath: projectRootRel,
    readmePath: path.posix.join(projectRootRel, "README.md"),
    readmeMarkdown,
    entries,
    ...(context.moduleId ? { moduleId: context.moduleId } : {}),
    ...(context.lessonId ? { lessonId: context.lessonId } : {}),
    ...(context.graphIndex ? { graphIndex: context.graphIndex } : {}),
  }];
}

async function loadLesson(lessonPath, courseSlug, moduleId, lessonDir) {
  const basePosix = path.posix.join("course", courseSlug, "modules", moduleId, "lessons", lessonDir);
  const meta = await readJsonSafe(path.join(lessonPath, "lesson.meta.json"));
  const readmeMarkdown = await readTextSafe(path.join(lessonPath, "README.md"));

  const lesson = {
    id: lessonDir,
    title: meta?.title || humanizeLessonTitle(lessonDir),
    path: path.posix.join(basePosix, "README.md"),
    markdown: readmeMarkdown,
    moduleId,
    ...(meta?.graphIndex ? { graphIndex: meta.graphIndex } : {}),
  };

  const projects = await loadProjectsFromRoot(path.join(lessonPath, "projects"), path.posix.join(basePosix, "projects"), {
    moduleId,
    lessonId: lessonDir,
    graphIndex: meta?.graphIndex,
  });

  const quizzes = await loadQuizzesFromDir(path.join(lessonPath, "quiz"), path.posix.join(basePosix, "quiz"));
  for (const quiz of quizzes) {
    quiz.moduleId = moduleId;
    quiz.lessonId = lessonDir;
    if (meta?.graphIndex && !quiz.graphIndex) quiz.graphIndex = meta.graphIndex;
  }

  return { lesson, projects, quizzes };
}

async function loadHierarchyModule(modulePath, courseSlug, moduleDir) {
  const meta = await readJsonSafe(path.join(modulePath, "module.meta.json"));
  const readmeMarkdown = await readTextSafe(path.join(modulePath, "README.md"));
  const lessonsPath = path.join(modulePath, "lessons");
  const lessonEntries = (await listDirSafe(lessonsPath)).filter((e) => e.isDirectory());

  const lessons = [];
  const projects = [];
  const quizzes = [];

  for (const lessonEnt of lessonEntries.sort((a, b) => a.name.localeCompare(b.name))) {
    const loaded = await loadLesson(path.join(lessonsPath, lessonEnt.name), courseSlug, moduleDir, lessonEnt.name);
    lessons.push(loaded.lesson);
    projects.push(...loaded.projects);
    quizzes.push(...loaded.quizzes);
  }

  const moduleQuizDir = path.join(modulePath, "quiz");
  quizzes.push(...await loadQuizzesFromDir(moduleQuizDir, path.posix.join("course", courseSlug, "modules", moduleDir, "quiz")));

  return {
    id: moduleDir,
    title: meta?.title || humanizeCourseTitle(moduleDir),
    graphIndex: meta?.graphIndex,
    readmePath: path.posix.join("course", courseSlug, "modules", moduleDir, "README.md"),
    readmeMarkdown,
    lessons,
    projects,
    quizzes,
  };
}

async function loadHierarchyCourse(coursePath, courseSlug) {
  const meta = await readJsonSafe(path.join(coursePath, "course.meta.json"));
  const readmeMarkdown = await readTextSafe(path.join(coursePath, "README.md"));
  const modulesPath = path.join(coursePath, "modules");
  const moduleEntries = (await listDirSafe(modulesPath)).filter((e) => e.isDirectory() && isProbablyLegacyModuleFolder(e.name));

  const modules = [];
  const lessons = [];
  const projects = [];
  const quizzes = [];

  for (const modEnt of moduleEntries.sort((a, b) => a.name.localeCompare(b.name))) {
    const mod = await loadHierarchyModule(path.join(modulesPath, modEnt.name), courseSlug, modEnt.name);
    modules.push(mod);
    lessons.push(...mod.lessons);
    projects.push(...mod.projects);
    quizzes.push(...mod.quizzes);
  }

  return {
    id: courseSlug,
    title: meta?.title || courseSlug,
    readmePath: path.posix.join("course", courseSlug, "README.md"),
    readmeMarkdown,
    modules,
    lessons,
    projects,
    quizzes,
    structure: "hierarchy",
  };
}

async function loadLegacyModule(moduleDir) {
  const modulePath = path.join(courseDir, moduleDir);
  const examplesDir = path.join(modulePath, "examples");
  const exampleEntries = await listDirSafe(examplesDir);
  const lessons = [];

  for (const e of exampleEntries.filter((ent) => ent.isFile() && ent.name.toLowerCase().endsWith(".md")).sort((a, b) => a.name.localeCompare(b.name))) {
    const lessonPath = path.posix.join("course", moduleDir, "examples", e.name);
    lessons.push({
      id: e.name.replace(/\.md$/i, ""),
      title: humanizeLessonTitle(e.name),
      path: lessonPath,
      markdown: await readTextSafe(path.join(repoRoot, lessonPath)),
      moduleId: moduleDir,
    });
  }

  const projects = await loadProjectsFromRoot(path.join(modulePath, "projects"), path.posix.join("course", moduleDir, "projects"), { moduleId: moduleDir });
  const quizzes = await loadQuizzesFromDir(path.join(modulePath, "quiz"), path.posix.join("course", moduleDir, "quiz"));

  return {
    id: moduleDir,
    title: humanizeCourseTitle(moduleDir),
    readmePath: path.posix.join("course", moduleDir, "README.md"),
    readmeMarkdown: await readTextSafe(path.join(modulePath, "README.md")),
    lessons,
    projects,
    quizzes,
    structure: "legacy",
  };
}

async function main() {
  const courses = [];
  const courseEntries = await listDirSafe(courseDir);

  for (const ent of courseEntries.filter((e) => e.isDirectory())) {
    const coursePath = path.join(courseDir, ent.name);
    const modulesPath = path.join(coursePath, "modules");

    try {
      await fs.access(modulesPath);
      courses.push(await loadHierarchyCourse(coursePath, ent.name));
      continue;
    } catch {
      // not a hierarchy course container
    }
  }

  const hierarchyModuleIds = new Set(
    courses.flatMap((c) => (c.modules || []).map((m) => m.id)),
  );

  for (const ent of courseEntries.filter((e) => e.isDirectory() && isProbablyLegacyModuleFolder(e.name))) {
    if (hierarchyModuleIds.has(ent.name)) continue;
    courses.push(await loadLegacyModule(ent.name));
  }

  courses.sort((a, b) => a.id.localeCompare(b.id));

  const outPath = path.join(repoRoot, "frontend", "src", "infrastructure", "static", "catalog.json");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify({ courses }, null, 2) + "\n", "utf8");

  console.log(`Wrote ${outPath}`);
  console.log(`Courses: ${courses.length}`);
  console.log(`Lessons: ${courses.reduce((sum, c) => sum + c.lessons.length, 0)}`);
  console.log(`Projects: ${courses.reduce((sum, c) => sum + c.projects.length, 0)}`);
  console.log(`Quizzes: ${courses.reduce((sum, c) => sum + c.quizzes.length, 0)}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
