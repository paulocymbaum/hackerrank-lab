const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function readStdin() {
  return new Promise((resolve, reject) => {
    let s = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (d) => (s += d));
    process.stdin.on("end", () => resolve(s));
    process.stdin.on("error", reject);
  });
}

function usage() {
  return [
    "Usage:",
    "  cat explanation.md | node .cursor/tools/teacher/add-explanation.js <moduleDir> [courseRoot=course] [targetFile=README.md]",
    "",
    "Example:",
    '  printf \"## Motivação\\n...\\n\" | node .cursor/tools/teacher/add-explanation.js 01-fundamentos-de-javascript',
    '  printf \"# Example\\n...\\n\" | node .cursor/tools/teacher/add-explanation.js 01-fundamentos-de-javascript course examples/01-truthy-falsy.md',
    "",
    "Rules:",
    "- Writes ONLY if the module folder contains .cursor-created.json (created by the boilerplate tool).",
    "- Appends the provided markdown to course/<moduleDir>/<targetFile> deterministically.",
    "- If the file already contains the same marker block, it will NOT append again (prevents duplication).",
  ].join("\n");
}

async function main() {
  const moduleDir = process.argv[2];
  const courseRootArg = process.argv[3] || "course";
  const targetFileArg = process.argv[4] || "README.md";

  if (!moduleDir) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const courseRoot = path.resolve(process.cwd(), courseRootArg);
  const modulePath = path.join(courseRoot, moduleDir);
  const markerPath = path.join(modulePath, ".cursor-created.json");
  const targetFile = String(targetFileArg).replace(/^[\\/]+/, "");
  const targetPath = path.join(modulePath, targetFile);

  if (!fs.existsSync(markerPath)) {
    process.stderr.write(
      `Refusing to write: missing marker ${path.relative(process.cwd(), markerPath)}\n`
    );
    process.exit(3);
  }

  const input = await readStdin();
  const content = String(input ?? "").replace(/\r\n/g, "\n").trim();
  if (!content) {
    process.stderr.write("No markdown provided on stdin.\n");
    process.exit(2);
  }

  const marker = JSON.parse(fs.readFileSync(markerPath, "utf8"));
  const markerId = `${marker.moduleDir || moduleDir}:${targetFile}`;

  const existing = fs.existsSync(targetPath)
    ? fs.readFileSync(targetPath, "utf8").replace(/\r\n/g, "\n")
    : "";

  const markerNeedle = [
    "<!-- cursor:teacher:add-explanation (deterministic) -->",
    `<!-- marker:${markerId} -->`,
  ].join("\n");

  if (existing.includes(markerNeedle)) {
    process.stdout.write(
      JSON.stringify(
        {
          wroteTo: path.relative(process.cwd(), targetPath),
          appendedChars: 0,
          skipped: true,
          reason: "Marker already present; refusing to duplicate content.",
        },
        null,
        2
      ) + "\n"
    );
    return;
  }

  const blockHeader = [
    "<!-- cursor:teacher:add-explanation (deterministic) -->",
    `<!-- marker:${markerId} -->`,
    "",
    "",
  ].join("\n");

  const prefix = existing.length === 0 || existing.endsWith("\n") ? "" : "\n";
  const toAppend = `${prefix}${blockHeader}${content}\n`;

  const toolDir = __dirname;
  const injectTool = path.resolve(toolDir, "../../../scripts/graph/utils/inject-markdown-file.js");
  const next = `${existing}${toAppend}`;

  execFileSync("node", [injectTool, targetFile, modulePath, next], {
    stdio: ["ignore", "ignore", "inherit"],
  });

  process.stdout.write(
    JSON.stringify(
      {
        wroteTo: path.relative(process.cwd(), targetPath),
        appendedChars: toAppend.length,
      },
      null,
      2
    ) + "\n"
  );
}

if (require.main === module) {
  main().catch((err) => {
    process.stderr.write(String(err?.stack || err) + "\n");
    process.exit(1);
  });
}

