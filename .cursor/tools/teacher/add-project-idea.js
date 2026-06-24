const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { projectReadmeSkeleton, starterIndexStub, lessonProjectsReadme } = require("./project-templates");

function kebabCase(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function pad2(n) {
  const x = String(n);
  return x.length >= 2 ? x : `0${x}`;
}

function pad3(n) {
  const x = String(n);
  if (x.length >= 3) return x;
  if (x.length === 2) return `0${x}`;
  return `00${x}`;
}

function usage() {
  return [
    "Usage (lesson hierarchy):",
    "  node add-project-idea.js <courseSlug> <moduleDir> <lessonDir> <projectNumber> <projectTitle> [courseRoot=course]",
    "",
    "Usage (legacy module):",
    "  node add-project-idea.js <moduleDir> <topicNumber> <topicTitle> <projectNumber> <projectTitle> [courseRoot=course]",
    "",
    "Examples:",
    '  node add-project-idea.js javascript 01-javascript-fundamentals 01.8.1-truthy-vs-falsy 1 "CLI Input Validator"',
    '  node add-project-idea.js 01-javascript-fundamentals 1 "Coercion" 1 "CLI Input Validator"',
  ].join("\n");
}

function isLessonMode(argv) {
  const first = argv[2];
  return first && !/^\d{2}-/.test(first);
}

function main() {
  const lessonMode = isLessonMode(process.argv);

  let basePath;
  let markerPath;
  let projectN;
  let projectTitleRaw;
  let topicDir;
  let projectsRoot;

  if (lessonMode) {
    const courseSlug = process.argv[2];
    const moduleDir = process.argv[3];
    const lessonDir = process.argv[4];
    const projectNumberRaw = process.argv[5];
    const projectTitle = process.argv[6];
    const courseRootArg = process.argv[7] || "course";

    if (!courseSlug || !moduleDir || !lessonDir || !projectNumberRaw || !projectTitle) {
      process.stderr.write(`${usage()}\n`);
      process.exit(2);
    }

    projectN = Number(projectNumberRaw);
    projectTitleRaw = projectTitle;
    const courseRoot = path.resolve(process.cwd(), courseRootArg);
    basePath = path.join(courseRoot, courseSlug, "modules", moduleDir, "lessons", lessonDir);
    markerPath = path.join(basePath, ".cursor-created.json");
    projectsRoot = path.join(basePath, "projects");
    topicDir = null;
  } else {
    const moduleDir = process.argv[2];
    const topicNumberRaw = process.argv[3];
    const topicTitleRaw = process.argv[4];
    const projectNumberRaw = process.argv[5];
    const projectTitle = process.argv[6];
    const courseRootArg = process.argv[7] || "course";

    if (!moduleDir || !topicNumberRaw || !topicTitleRaw || !projectNumberRaw || !projectTitle) {
      process.stderr.write(`${usage()}\n`);
      process.exit(2);
    }

    const topicN = Number(topicNumberRaw);
    projectN = Number(projectNumberRaw);
    projectTitleRaw = projectTitle;
    if (!Number.isFinite(topicN) || !Number.isFinite(projectN) || topicN < 0 || projectN < 0) {
      process.stderr.write("Invalid topicNumber or projectNumber.\n");
      process.exit(2);
    }

    const courseRoot = path.resolve(process.cwd(), courseRootArg);
    basePath = path.join(courseRoot, moduleDir);
    markerPath = path.join(basePath, ".cursor-created.json");
    projectsRoot = path.join(basePath, "projects");
    topicDir = `${pad2(topicN)}-${kebabCase(topicTitleRaw)}`;
  }

  if (!Number.isFinite(projectN) || projectN < 0) {
    process.stderr.write("Invalid projectNumber.\n");
    process.exit(2);
  }

  if (!fs.existsSync(markerPath)) {
    process.stderr.write(`Refusing to write: missing marker ${path.relative(process.cwd(), markerPath)}\n`);
    process.exit(3);
  }

  const projectDir = `${pad3(projectN)}-${kebabCase(projectTitleRaw)}`;
  const toolDir = __dirname;
  const createFolderTool = path.resolve(toolDir, "../../../scripts/graph/utils/create-folder.js");
  const injectTool = path.resolve(toolDir, "../../../scripts/graph/utils/inject-markdown-file.js");

  execFileSync("node", [createFolderTool, "projects", basePath], { stdio: ["ignore", "ignore", "inherit"] });

  let projectPath;
  if (lessonMode) {
    projectPath = path.join(projectsRoot, projectDir);
    execFileSync("node", [createFolderTool, projectDir, projectsRoot], { stdio: ["ignore", "ignore", "inherit"] });

    const projectsReadmePath = path.join(projectsRoot, "README.md");
    if (!fs.existsSync(projectsReadmePath)) {
      const md = lessonProjectsReadme(projectTitleRaw);
      execFileSync("node", [injectTool, "README.md", projectsRoot, md], { stdio: ["ignore", "ignore", "inherit"] });
    }
  } else {
    const topicPath = path.join(projectsRoot, topicDir);
    projectPath = path.join(topicPath, projectDir);
    execFileSync("node", [createFolderTool, topicDir, projectsRoot], { stdio: ["ignore", "ignore", "inherit"] });
    execFileSync("node", [createFolderTool, projectDir, topicPath], { stdio: ["ignore", "ignore", "inherit"] });
  }

  execFileSync("node", [createFolderTool, "starter", projectPath], { stdio: ["ignore", "ignore", "inherit"] });
  execFileSync("node", [createFolderTool, "solution", projectPath], { stdio: ["ignore", "ignore", "inherit"] });

  const readmePath = path.join(projectPath, "README.md");
  if (fs.existsSync(readmePath)) {
    process.stderr.write(`Refusing to overwrite existing ${path.relative(process.cwd(), readmePath)}\n`);
    process.exit(4);
  }

  execFileSync("node", [injectTool, "README.md", projectPath, projectReadmeSkeleton(projectTitleRaw)], {
    stdio: ["ignore", "ignore", "inherit"],
  });

  const starterPath = path.join(projectPath, "starter", "index.js");
  if (!fs.existsSync(starterPath)) {
    fs.writeFileSync(starterPath, starterIndexStub(projectTitleRaw), "utf8");
  }

  process.stdout.write(
    JSON.stringify({
      mode: lessonMode ? "lesson" : "legacy-module",
      projectDir,
      created: {
        projectPath: path.relative(process.cwd(), projectPath),
        readme: path.relative(process.cwd(), readmePath),
      },
    }, null, 2) + "\n",
  );
}

if (require.main === module) main();
