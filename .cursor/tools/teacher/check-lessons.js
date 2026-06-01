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

function usage() {
  return [
    "Usage: node .cursor/tools/teacher/check-lessons.js [courseRoot=course]",
    "",
    "What it does:",
    "- Scans the repo for modules under course/",
    "- Reports module folders and whether required files exist (README.md, projects/README.md).",
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
    return {
      moduleDir: dir,
      modulePath: path.relative(process.cwd(), modulePath),
      exists: {
        readme: fs.existsSync(readmePath),
        projectsReadme: fs.existsSync(projectsReadmePath),
        examplesDir: isDir(examplesPath),
      },
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

