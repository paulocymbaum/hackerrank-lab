const path = require("path");
const { execFileSync } = require("child_process");

function usage() {
  return [
    "Usage: node .cursor/tools/teacher/create-lesson-folder.js <graphIndex> [--course <slug>] [--dry-run]",
    "",
    'Example: node .cursor/tools/teacher/create-lesson-folder.js "01.8.1"',
    "",
    "Delegates to scripts/graph/scaffold-from-graph.mjs to create a lesson folder",
    "under course/<course>/modules/<module>/lessons/<graphIndex>-<slug>/",
  ].join("\n");
}

function main() {
  const graphIndex = process.argv[2];
  if (!graphIndex || graphIndex.startsWith("-")) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const toolDir = __dirname;
  const scaffoldTool = path.resolve(toolDir, "../../../scripts/graph/scaffold-from-graph.mjs");
  const extraArgs = process.argv.slice(3);

  execFileSync("node", [scaffoldTool, graphIndex, ...extraArgs], { stdio: "inherit" });
}

if (require.main === module) main();
