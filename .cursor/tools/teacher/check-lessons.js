const fs = require("fs");
const path = require("path");

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function listDirs(p) {
  try {
    return fs
      .readdirSync(p, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function countLessonProjects(lessonPath) {
  const projectsRoot = path.join(lessonPath, "projects");
  if (!isDir(projectsRoot)) return { projects: 0, withReadme: 0 };

  let projects = 0;
  let withReadme = 0;
  for (const project of listDirs(projectsRoot)) {
    if (project === "node_modules") continue;
    const projectPath = path.join(projectsRoot, project);
    if (!isDir(projectPath)) continue;
    projects += 1;
    const readme = path.join(projectPath, "README.md");
    if (fs.existsSync(readme) && fs.readFileSync(readme, "utf8").trim()) withReadme += 1;
  }
  return { projects, withReadme };
}

function countLegacyProjects(modulePath) {
  const projectsRoot = path.join(modulePath, "projects");
  if (!isDir(projectsRoot)) return { topics: 0, projects: 0, withReadme: 0 };

  let topics = 0;
  let projects = 0;
  let withReadme = 0;
  for (const topic of listDirs(projectsRoot)) {
    topics += 1;
    const topicPath = path.join(projectsRoot, topic);
    for (const project of listDirs(topicPath)) {
      projects += 1;
      const readme = path.join(topicPath, project, "README.md");
      if (fs.existsSync(readme) && fs.readFileSync(readme, "utf8").trim()) withReadme += 1;
    }
  }
  return { topics, projects, withReadme };
}

function scanLesson(lessonPath, lessonDir) {
  const meta = readJsonSafe(path.join(lessonPath, "lesson.meta.json"));
  const readmePath = path.join(lessonPath, "README.md");
  const quizDir = path.join(lessonPath, "quiz");
  return {
    lessonDir,
    lessonPath: path.relative(process.cwd(), lessonPath),
    graphIndex: meta?.graphIndex ?? null,
    exists: {
      readme: fs.existsSync(readmePath) && fs.readFileSync(readmePath, "utf8").trim().length > 0,
      lessonMeta: !!meta,
      marker: fs.existsSync(path.join(lessonPath, ".cursor-created.json")),
      quizDir: isDir(quizDir),
      projectsDir: isDir(path.join(lessonPath, "projects")),
    },
    projects: countLessonProjects(lessonPath),
  };
}

function scanModule(modulePath, moduleDir, structure) {
  const lessonsPath = path.join(modulePath, "lessons");
  const lessons = isDir(lessonsPath)
    ? listDirs(lessonsPath).sort().map((d) => scanLesson(path.join(lessonsPath, d), d))
    : [];

  return {
    moduleDir,
    modulePath: path.relative(process.cwd(), modulePath),
    structure,
    exists: {
      readme: fs.existsSync(path.join(modulePath, "README.md")),
      moduleMeta: fs.existsSync(path.join(modulePath, "module.meta.json")),
      lessonsDir: isDir(lessonsPath),
    },
    lessons,
    lessonCount: lessons.length,
    legacyProjects: structure === "legacy" ? countLegacyProjects(modulePath) : null,
  };
}

function scanNewHierarchy(courseRoot) {
  const results = [];
  for (const courseSlug of listDirs(courseRoot)) {
    const coursePath = path.join(courseRoot, courseSlug);
    const modulesPath = path.join(coursePath, "modules");
    if (!isDir(modulesPath)) continue;

    for (const moduleDir of listDirs(modulesPath).filter((n) => /^\d{2}-/.test(n)).sort()) {
      results.push(scanModule(path.join(modulesPath, moduleDir), moduleDir, "hierarchy"));
    }
  }
  return results;
}

function scanLegacy(courseRoot) {
  return listDirs(courseRoot)
    .filter((name) => /^\d{2}-/.test(name) || name === "00-welcome")
    .sort()
    .map((dir) => scanModule(path.join(courseRoot, dir), dir, "legacy"));
}

function usage() {
  return [
    "Usage: node .cursor/tools/teacher/check-lessons.js [courseRoot=course]",
    "",
    "Scans course/ for modules (new hierarchy and legacy flat) and reports lesson completeness.",
  ].join("\n");
}

function main() {
  const courseRootArg = process.argv[2] || "course";
  const courseRoot = path.resolve(process.cwd(), courseRootArg);

  if (!isDir(courseRoot)) {
    process.stderr.write(`Invalid courseRoot: ${courseRootArg}\n${usage()}\n`);
    process.exit(2);
  }

  const hierarchyModules = scanNewHierarchy(courseRoot);
  const legacyModules = scanLegacy(courseRoot);

  process.stdout.write(
    JSON.stringify({
      courseRoot: path.relative(process.cwd(), courseRoot),
      hierarchyModules: hierarchyModules.length,
      legacyModules: legacyModules.length,
      modules: [...hierarchyModules, ...legacyModules],
    }, null, 2) + "\n",
  );
}

if (require.main === module) main();
