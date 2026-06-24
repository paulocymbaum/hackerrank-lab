const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

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

function usage() {
  return [
    "Usage: node .cursor/tools/teacher/create-module-folder.js <courseSlug> <moduleNumber> <moduleTitle> [courseRoot=course]",
    "",
    'Example: node .cursor/tools/teacher/create-module-folder.js javascript 1 "JavaScript Fundamentals"',
    "",
    "Creates:",
    "course/<course>/modules/<NN-kebab-title>/",
    "  README.md",
    "  module.meta.json",
    "  lessons/",
    "  .cursor-created.json",
  ].join("\n");
}

function main() {
  const courseSlug = process.argv[2];
  const moduleNumberRaw = process.argv[3];
  const titleRaw = process.argv[4];
  const courseRootArg = process.argv[5] || "course";

  if (!courseSlug || !moduleNumberRaw || !titleRaw) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const n = Number(moduleNumberRaw);
  if (!Number.isFinite(n) || n < 0) {
    process.stderr.write(`Invalid moduleNumber: ${moduleNumberRaw}\n`);
    process.exit(2);
  }

  const moduleDir = `${pad2(n)}-${kebabCase(titleRaw)}`;
  const courseRoot = path.resolve(process.cwd(), courseRootArg);
  const coursePath = path.join(courseRoot, courseSlug);
  const modulesPath = path.join(coursePath, "modules");
  const modulePath = path.join(modulesPath, moduleDir);

  const toolDir = __dirname;
  const createFolderTool = path.resolve(toolDir, "../../../scripts/graph/utils/create-folder.js");
  const injectTool = path.resolve(toolDir, "../../../scripts/graph/utils/inject-markdown-file.js");

  execFileSync("node", [createFolderTool, courseSlug, courseRoot], { stdio: ["ignore", "ignore", "inherit"] });
  execFileSync("node", [createFolderTool, "modules", coursePath], { stdio: ["ignore", "ignore", "inherit"] });
  execFileSync("node", [createFolderTool, moduleDir, modulesPath], { stdio: ["ignore", "ignore", "inherit"] });
  execFileSync("node", [createFolderTool, "lessons", modulePath], { stdio: ["ignore", "ignore", "inherit"] });

  const markerPath = path.join(modulePath, ".cursor-created.json");
  const marker = {
    createdBy: "cursor-tool",
    tool: ".cursor/tools/teacher/create-module-folder.js",
    createdAt: new Date().toISOString(),
    kind: "module",
    courseSlug,
    moduleNumber: pad2(n),
    moduleTitle: String(titleRaw),
    moduleDir,
  };

  const readmePath = path.join(modulePath, "README.md");
  if (!fs.existsSync(readmePath)) {
    const md = [
      `# ${titleRaw}`,
      "",
      "## Motivation",
      "",
      "## Lesson map",
      "",
      "## Checklist",
      "",
    ].join("\n");
    execFileSync("node", [injectTool, "README.md", modulePath, md], { stdio: ["ignore", "ignore", "inherit"] });
  }

  const metaPath = path.join(modulePath, "module.meta.json");
  if (!fs.existsSync(metaPath)) {
    const meta = {
      id: moduleDir,
      graphIndex: pad2(n),
      graphNodeId: "",
      title: String(titleRaw),
    };
    execFileSync("node", [injectTool, "module.meta.json", modulePath, JSON.stringify(meta, null, 2)], {
      stdio: ["ignore", "ignore", "inherit"],
    });
  }

  execFileSync("node", [injectTool, ".cursor-created.json", modulePath, JSON.stringify(marker, null, 2)], {
    stdio: ["ignore", "ignore", "inherit"],
  });

  process.stdout.write(
    JSON.stringify(
      {
        courseSlug,
        courseRoot: path.relative(process.cwd(), courseRoot),
        moduleDir,
        modulePath: path.relative(process.cwd(), modulePath),
        created: {
          marker: path.relative(process.cwd(), markerPath),
          readme: path.relative(process.cwd(), readmePath),
        },
      },
      null,
      2,
    ) + "\n",
  );
}

if (require.main === module) main();
