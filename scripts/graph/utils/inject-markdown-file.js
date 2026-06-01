const fs = require("fs");
const path = require("path");

function usage() {
  return [
    "Usage:",
    "  node scripts/graph/utils/inject-markdown-file.js <fileName> <dirPath> <markdown>",
    "",
    "Example (bash):",
    '  node scripts/graph/utils/inject-markdown-file.js README.md course/01-foo \"# Title\\n\\n## Section\\nText\"',
    "",
    "Notes:",
    "- <markdown> must be passed as a multi-line string by the shell (e.g. quoted or via command substitution).",
    "- Creates the directory if needed.",
    "- Deterministic: overwrites the target file with EXACT provided content (newline-normalized).",
  ].join("\n");
}

function main() {
  const fileName = process.argv[2];
  const dirPathArg = process.argv[3];
  const markdownArg = process.argv.slice(4).join(" ");

  if (!fileName || !dirPathArg || !markdownArg) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const dirPath = path.resolve(process.cwd(), dirPathArg);
  const filePath = path.join(dirPath, fileName);

  const content = String(markdownArg).replace(/\r\n/g, "\n");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.endsWith("\n") ? content : content + "\n", "utf8");

  process.stdout.write(
    JSON.stringify(
      {
        wroteTo: path.relative(process.cwd(), filePath),
        bytes: Buffer.byteLength(content, "utf8"),
      },
      null,
      2
    ) + "\n"
  );
}

if (require.main === module) main();

