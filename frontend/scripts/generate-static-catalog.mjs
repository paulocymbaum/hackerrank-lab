import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const courseDir = path.join(repoRoot, "course");

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

async function listDirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
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
      }))
      .sort((a, b) => a.path.localeCompare(b.path));

    courses.push({
      id: courseFolder,
      title: humanizeCourseTitle(courseFolder),
      lessons,
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
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

