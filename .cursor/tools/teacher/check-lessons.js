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

function countProjects(modulePath) {
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
      if (fs.existsSync(path.join(topicPath, project, "README.md"))) {
        const raw = fs.readFileSync(path.join(topicPath, project, "README.md"), "utf8");
        if (raw.trim()) withReadme += 1;
      }
    }
  }

  return { topics, projects, withReadme };
}

function usage() {
  return [
    "Usage: node .cursor/tools/teacher/check-lessons.js [courseRoot=course]",
    "",
    "What it does:",
    "- Scans the repo for modules under course/",
    "- Reports module folders and whether required files exist (README.md, projects/README.md).",
    "- Summarizes project folders (total vs render-ready README).",
    "",
    "For PBL validation, run:",
    "  node .cursor/skills/create-course-project/scripts/validate-project.mjs --all",
    "",
    "Exit codes:",
    "- 0: scan succeeded",
    "- 2: invalid courseRoot",
  ].join("\n");
}

function main() {
  const courseRootArg = process.argv[2] || "course";
  const courseRoot = path.resolve(process.cwd(), courseRootArg);

  if (!isDir(courseRoot)) {
    process.stderr.write(`Invalid courseRoot: ${courseRootArg}\n${usage()}\n`);
    process.exit(2);
  }

  const moduleDirs = listDirs(courseRoot)
    .filter((name) => /^\d{2}-/.test(name) || name === "00-welcome")
    .sort((a, b) => a.localeCompare(b, "en"));

  const results = moduleDirs.map((dir) => {
    const modulePath = path.join(courseRoot, dir);
    const readmePath = path.join(modulePath, "README.md");
    const projectsReadmePath = path.join(modulePath, "projects", "README.md");
    const examplesPath = path.join(modulePath, "examples");
    const projectCounts = countProjects(modulePath);
    return {
      moduleDir: dir,
      modulePath: path.relative(process.cwd(), modulePath),
      exists: {
        readme: fs.existsSync(readmePath),
        projectsReadme: fs.existsSync(projectsReadmePath),
        examplesDir: isDir(examplesPath),
      },
      projects: projectCounts,
    };
  });

  process.stdout.write(
    JSON.stringify(
      {
        courseRoot: path.relative(process.cwd(), courseRoot),
        modulesFound: results.length,
        modules: results,
      },
      null,
      2
    ) + "\n"
  );
}

if (require.main === module) main();

