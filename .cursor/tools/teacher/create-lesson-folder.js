const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { moduleProjectsReadme } = require("./project-templates");

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
    "Usage: node .cursor/tools/teacher/create-lesson-folder.js <moduleNumber> <moduleTitle> [courseRoot=course]",
    "",
    'Example: node .cursor/tools/teacher/create-lesson-folder.js 1 "Fundamentos de JavaScript"',
    "",
    "Creates:",
    "course/<NN-kebab-title>/",
    "  README.md",
    "  examples/",
    "  projects/README.md",
    "  .cursor-created.json  (marker file)",
  ].join("\n");
}

function main() {
  const moduleNumberRaw = process.argv[2];
  const titleRaw = process.argv[3];
  const courseRootArg = process.argv[4] || "course";

  if (!moduleNumberRaw || !titleRaw) {
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
  const modulePath = path.join(courseRoot, moduleDir);

  const toolDir = __dirname;
  const createFolderTool = path.resolve(toolDir, "../../../scripts/graph/utils/create-folder.js");
  const injectTool = path.resolve(toolDir, "../../../scripts/graph/utils/inject-markdown-file.js");

  // Folder structure via shared tool.
  execFileSync("node", [createFolderTool, moduleDir, courseRoot], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execFileSync("node", [createFolderTool, "examples", modulePath], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execFileSync("node", [createFolderTool, "projects", modulePath], {
    stdio: ["ignore", "ignore", "inherit"],
  });

  const markerPath = path.join(modulePath, ".cursor-created.json");
  const marker = {
    createdBy: "cursor-tool",
    tool: ".cursor/tools/teacher/create-lesson-folder.js",
    createdAt: new Date().toISOString(),
    moduleNumber: pad2(n),
    moduleTitle: String(titleRaw),
    moduleDir,
  };

  // Deterministic behavior: do not overwrite content files if already present.
  const readmePath = path.join(modulePath, "README.md");
  if (!fs.existsSync(readmePath)) {
    const md = [
      `# ${titleRaw}`,
      "",
      "## Motivação",
      "",
      "## Definições e termos",
      "",
      "## Anti-padrões comuns (e como evitar)",
      "",
      "## Boas práticas e trade-offs",
      "",
      "## Checklist (o que dominar)",
      "",
    ].join("\n");
    execFileSync("node", [injectTool, "README.md", modulePath, md], {
      stdio: ["ignore", "ignore", "inherit"],
    });
  }

  const projectsReadmePath = path.join(modulePath, "projects", "README.md");
  if (!fs.existsSync(projectsReadmePath)) {
    const md = moduleProjectsReadme(titleRaw);
    execFileSync("node", [injectTool, "README.md", path.join(modulePath, "projects"), md], {
      stdio: ["ignore", "ignore", "inherit"],
    });
  }

  execFileSync("node", [injectTool, ".cursor-created.json", modulePath, JSON.stringify(marker, null, 2)], {
    stdio: ["ignore", "ignore", "inherit"],
  });

  process.stdout.write(
    JSON.stringify(
      {
        courseRoot: path.relative(process.cwd(), courseRoot),
        moduleDir,
        modulePath: path.relative(process.cwd(), modulePath),
        created: {
          marker: path.relative(process.cwd(), markerPath),
          readme: path.relative(process.cwd(), readmePath),
          projectsReadme: path.relative(process.cwd(), projectsReadmePath),
        },
      },
      null,
      2
    ) + "\n"
  );
}

if (require.main === module) main();

