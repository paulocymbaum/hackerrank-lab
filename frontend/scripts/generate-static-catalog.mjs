import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const courseDir = path.join(repoRoot, "course");

const MAX_FILE_BYTES = 200_000;
const TEXT_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".json",
  ".css",
  ".html",
  ".yml",
  ".yaml",
]);

function isProbablyCourseFolder(name) {
  return /^\d{2}-/.test(name);
}

function leadingNumberPrefix(value) {
  const match = value.match(/^(\d{2})-/);
  return match ? match[1] : null;
}

function humanizeCourseTitle(folderName) {
  const n = leadingNumberPrefix(folderName);
  const title = folderName
    .replace(/^\d{2}-/, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
  return n ? `${n} — ${title}` : title;
}

function humanizeLessonTitle(fileName) {
  const n = leadingNumberPrefix(fileName);
  const title = fileName
    .replace(/^\d{2}-/, "")
    .replace(/\.md$/i, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
  return n ? `${n}. ${title}` : title;
}

function humanizeProjectTitle(folderName) {
  const n = leadingNumberPrefix(folderName);
  const title = folderName
    .replace(/^\d{3}-/, "")
    .replace(/^\d{2}-/, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
  return n ? `${n}. ${title}` : title;
}

function humanizeQuizTitle(fileName) {
  const n = leadingNumberPrefix(fileName);
  const title = fileName
    .replace(/^\d{2}-/, "")
    .replace(/\.json$/i, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
  return n ? `${n}. ${title}` : title;
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

async function walkProjectRoot(absRootDir) {
  /** @type {Array<{path: string, kind: "dir" | "file", readmeMarkdown?: string, content?: string}>} */
  const entries = [];

  async function walk(absDir, relDirPosix) {
    // Always include the directory node.
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

      const ext = path.extname(ent.name).toLowerCase();
      if (!TEXT_EXTENSIONS.has(ext)) {
        entries.push({ path: relFromRoot, kind: "file" });
        continue;
      }

      const content = await readTextSafe(absChild);
      entries.push({
        path: relFromRoot,
        kind: "file",
        ...(content.trim() ? { content } : {}),
      });
    }
  }

  await walk(absRootDir, "");
  // Sort: dirs first, then files, stable by path
  entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
    return a.path.localeCompare(b.path);
  });
  return entries;
}

async function loadQuizzes(courseFolder) {
  const quizDir = path.join(courseDir, courseFolder, "quiz");
  const quizEntries = await listDirSafe(quizDir);
  const quizzes = [];

  for (const ent of quizEntries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))) {
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
        path: path.posix.join("course", courseFolder, "quiz", ent.name),
        questions: parsed.questions,
      });
    } catch {
      console.warn(`Skipping unreadable quiz JSON: ${absPath}`);
    }
  }

  quizzes.sort((a, b) => a.path.localeCompare(b.path));
  return quizzes;
}

async function main() {
  const courseEntries = await listDirSafe(courseDir);
  const courseFolders = courseEntries
    .filter((e) => e.isDirectory() && isProbablyCourseFolder(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  const courses = [];
  for (const courseFolder of courseFolders) {
    const examplesDir = path.join(courseDir, courseFolder, "examples");
    const exampleEntries = await listDirSafe(examplesDir);
    const lessons = exampleEntries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
      .map((e) => ({
        title: humanizeLessonTitle(e.name),
        path: path.posix.join("course", courseFolder, "examples", e.name),
        markdown: "",
      }))
      .sort((a, b) => a.path.localeCompare(b.path));

    for (const lesson of lessons) {
      const absLessonPath = path.join(repoRoot, lesson.path);
      // Embed markdown so the browser doesn't need filesystem access.
      lesson.markdown = await readTextSafe(absLessonPath);
    }

    const courseReadmePath = path.posix.join("course", courseFolder, "README.md");
    const courseReadmeAbs = path.join(repoRoot, courseReadmePath);
    const courseReadmeMarkdown = await readTextSafe(courseReadmeAbs);

    const projectsRootDir = path.join(courseDir, courseFolder, "projects");
    const projectGroupEntries = await listDirSafe(projectsRootDir);
    const projects = [];

    for (const group of projectGroupEntries.filter((e) => e.isDirectory())) {
      const groupDir = path.join(projectsRootDir, group.name);
      const projectEntries = await listDirSafe(groupDir);

      for (const projectDirEnt of projectEntries.filter((e) => e.isDirectory())) {
        const projectDir = path.join(groupDir, projectDirEnt.name);
        const projectRootRel = path.posix.join(
          "course",
          courseFolder,
          "projects",
          group.name,
          projectDirEnt.name,
        );
        const readmeAbs = path.join(projectDir, "README.md");
        const readmeRel = path.posix.join(
          "course",
          courseFolder,
          "projects",
          group.name,
          projectDirEnt.name,
          "README.md",
        );
        const readmeMarkdown = await readTextSafe(readmeAbs);

        if (!readmeMarkdown.trim()) continue;

        const entries = await walkProjectRoot(projectDir);

        projects.push({
          id: projectDirEnt.name,
          title: humanizeProjectTitle(projectDirEnt.name),
          rootPath: projectRootRel,
          readmePath: readmeRel,
          readmeMarkdown,
          entries,
        });
      }
    }

    projects.sort((a, b) => a.readmePath.localeCompare(b.readmePath));

    const quizzes = await loadQuizzes(courseFolder);

    courses.push({
      id: courseFolder,
      title: humanizeCourseTitle(courseFolder),
      readmePath: courseReadmePath,
      readmeMarkdown: courseReadmeMarkdown,
      lessons,
      projects,
      quizzes,
    });
  }

  const outPath = path.join(
    repoRoot,
    "frontend",
    "src",
    "infrastructure",
    "static",
    "catalog.json",
  );
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

