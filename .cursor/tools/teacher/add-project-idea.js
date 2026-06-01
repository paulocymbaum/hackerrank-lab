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

function pad3(n) {
  const x = String(n);
  if (x.length >= 3) return x;
  if (x.length === 2) return `0${x}`;
  return `00${x}`;
}

function usage() {
  return [
    "Usage: node .cursor/tools/teacher/add-project-idea.js <moduleDir> <topicNumber> <topicTitle> <projectNumber> <projectTitle> [courseRoot=course]",
    "",
    "Example:",
    '  node .cursor/tools/teacher/add-project-idea.js 01-fundamentos-de-javascript 1 \"Sintaxe e Estruturas\" 1 \"Calculadora CLI\"',
    "",
    "Creates (if missing):",
    "course/<moduleDir>/projects/<TT-kebab-topic>/<PPP-kebab-project>/",
    "  README.md  (PBL template from COURSE_STRUCTURE.md)",
    "  starter/",
    "  solution/",
    "",
    "Safety:",
    "- Refuses to write unless course/<moduleDir>/.cursor-created.json exists (module created by boilerplate tool).",
    "- Refuses to overwrite an existing project README.md.",
  ].join("\n");
}

function main() {
  const moduleDir = process.argv[2];
  const topicNumberRaw = process.argv[3];
  const topicTitleRaw = process.argv[4];
  const projectNumberRaw = process.argv[5];
  const projectTitleRaw = process.argv[6];
  const courseRootArg = process.argv[7] || "course";

  if (
    !moduleDir ||
    !topicNumberRaw ||
    !topicTitleRaw ||
    !projectNumberRaw ||
    !projectTitleRaw
  ) {
    process.stderr.write(`${usage()}\\n`);
    process.exit(2);
  }

  const topicN = Number(topicNumberRaw);
  const projectN = Number(projectNumberRaw);
  if (!Number.isFinite(topicN) || !Number.isFinite(projectN) || topicN < 0 || projectN < 0) {
    process.stderr.write("Invalid topicNumber or projectNumber.\\n");
    process.exit(2);
  }

  const courseRoot = path.resolve(process.cwd(), courseRootArg);
  const modulePath = path.join(courseRoot, moduleDir);
  const markerPath = path.join(modulePath, ".cursor-created.json");

  if (!fs.existsSync(markerPath)) {
    process.stderr.write(
      `Refusing to write: missing marker ${path.relative(process.cwd(), markerPath)}\\n`
    );
    process.exit(3);
  }

  const topicDir = `${pad2(topicN)}-${kebabCase(topicTitleRaw)}`;
  const projectDir = `${pad3(projectN)}-${kebabCase(projectTitleRaw)}`;

  const toolDir = __dirname;
  const createFolderTool = path.resolve(toolDir, "../../../scripts/graph/utils/create-folder.js");
  const injectTool = path.resolve(toolDir, "../../../scripts/graph/utils/inject-markdown-file.js");

  const projectsRoot = path.join(modulePath, "projects");
  const topicPath = path.join(projectsRoot, topicDir);
  const projectPath = path.join(topicPath, projectDir);

  // Ensure folders exist (empty folders are fine).
  execFileSync("node", [createFolderTool, "projects", modulePath], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execFileSync("node", [createFolderTool, topicDir, projectsRoot], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execFileSync("node", [createFolderTool, projectDir, topicPath], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execFileSync("node", [createFolderTool, "starter", projectPath], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execFileSync("node", [createFolderTool, "solution", projectPath], {
    stdio: ["ignore", "ignore", "inherit"],
  });

  const readmePath = path.join(projectPath, "README.md");
  if (fs.existsSync(readmePath)) {
    process.stderr.write(
      `Refusing to overwrite existing ${path.relative(process.cwd(), readmePath)}\\n`
    );
    process.exit(4);
  }

  const md = [
    `# ${projectTitleRaw}`,
    "",
    "## Problem context",
    "",
    "## Goal",
    "",
    "## Functional requirements",
    "- [ ]",
    "",
    "## Non-functional requirements",
    "- [ ] Readability and maintainability",
    "- [ ] Error handling",
    "- [ ] Performance (when applicable)",
    "",
    "## Constraints",
    "- [ ]",
    "",
    "## Acceptance criteria",
    "- [ ]",
    "",
    "## Example data (if applicable)",
    "",
    "## Suggested plan (no solution)",
    "1.",
    "",
    "## Deliverables",
    "- [ ] Code in `starter/`",
    "- [ ] (Optional) reference in `solution/`",
    "",
    "## Extensions (optional)",
    "- [ ]",
    "",
  ].join("\n");

  execFileSync("node", [injectTool, "README.md", projectPath, md], {
    stdio: ["ignore", "ignore", "inherit"],
  });

  process.stdout.write(
    JSON.stringify(
      {
        moduleDir,
        topicDir,
        projectDir,
        created: {
          projectPath: path.relative(process.cwd(), projectPath),
          readme: path.relative(process.cwd(), readmePath),
          starter: path.relative(process.cwd(), path.join(projectPath, "starter")),
          solution: path.relative(process.cwd(), path.join(projectPath, "solution")),
        },
      },
      null,
      2
    ) + "\\n"
  );
}

if (require.main === module) main();

