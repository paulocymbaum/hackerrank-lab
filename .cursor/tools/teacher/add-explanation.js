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
    "Usage (new hierarchy):",
    "  cat explanation.md | node add-explanation.js <courseSlug> <moduleDir> <lessonDir> [courseRoot=course] [targetFile=README.md]",
    "",
    "Usage (legacy):",
    "  cat explanation.md | node add-explanation.js <moduleDir> [courseRoot=course] [targetFile=README.md]",
    "",
    "Examples:",
    '  cat explanation.md | node add-explanation.js javascript 01-javascript-fundamentals 01.8.1-truthy-vs-falsy',
    '  cat explanation.md | node add-explanation.js 01-javascript-fundamentals course README.md',
  ].join("\n");
}

function resolveTargetPaths(argv) {
  const courseRootArg = argv.find((a, i) => argv[i - 1] !== "--course" && !a.startsWith("-")) || "course";
  let courseSlug = null;
  let moduleDir = null;
  let lessonDir = null;
  let targetFile = "README.md";

  const positional = argv.filter((a) => !a.startsWith("-"));

  if (positional.length >= 3 && !/^\d{2}-/.test(positional[0])) {
    [courseSlug, moduleDir, lessonDir] = positional.slice(0, 3);
    if (positional[3] && !positional[3].includes("/") && positional[3] !== "course") {
      targetFile = positional[4] || positional[3];
    } else if (positional[3]) {
      targetFile = positional[4] || "README.md";
    }
    const courseRootName = positional[3] && !positional[3].endsWith(".md") ? positional[3] : "course";
    const courseRoot = path.resolve(process.cwd(), courseRootName);
    const basePath = path.join(courseRoot, courseSlug, "modules", moduleDir, "lessons", lessonDir);
    return { basePath, targetFile, markerId: `${courseSlug}/${moduleDir}/${lessonDir}:${targetFile}` };
  }

  moduleDir = positional[0];
  const courseRoot = path.resolve(process.cwd(), positional[1] || "course");
  targetFile = positional[2] || "README.md";
  const basePath = path.join(courseRoot, moduleDir);
  return { basePath, targetFile, markerId: `${moduleDir}:${targetFile}` };
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const { basePath, targetFile, markerId } = resolveTargetPaths(argv);
  const markerPath = path.join(basePath, ".cursor-created.json");
  const targetPath = path.join(basePath, targetFile.replace(/^[\\/]+/, ""));

  if (!fs.existsSync(markerPath)) {
    process.stderr.write(`Refusing to write: missing marker ${path.relative(process.cwd(), markerPath)}\n`);
    process.exit(3);
  }

  const input = await readStdin();
  const content = String(input ?? "").replace(/\r\n/g, "\n").trim();
  if (!content) {
    process.stderr.write("No markdown provided on stdin.\n");
    process.exit(2);
  }

  const existing = fs.existsSync(targetPath)
    ? fs.readFileSync(targetPath, "utf8").replace(/\r\n/g, "\n")
    : "";

  const markerNeedle = [
    "<!-- cursor:teacher:add-explanation (deterministic) -->",
    `<!-- marker:${markerId} -->`,
  ].join("\n");

  if (existing.includes(markerNeedle)) {
    process.stdout.write(
      JSON.stringify({
        wroteTo: path.relative(process.cwd(), targetPath),
        appendedChars: 0,
        skipped: true,
        reason: "Marker already present; refusing to duplicate content.",
      }, null, 2) + "\n",
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

  execFileSync("node", [injectTool, path.basename(targetPath), basePath, next], {
    stdio: ["ignore", "ignore", "inherit"],
  });

  process.stdout.write(
    JSON.stringify({
      wroteTo: path.relative(process.cwd(), targetPath),
      appendedChars: toAppend.length,
    }, null, 2) + "\n",
  );
}

if (require.main === module) {
  main().catch((err) => {
    process.stderr.write(String(err?.stack || err) + "\n");
    process.exit(1);
  });
}
