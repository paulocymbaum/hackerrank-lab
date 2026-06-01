const fs = require("fs");
const path = require("path");

function usage() {
  return [
    "Usage: node scripts/graph/utils/create-folder.js <folderName> <parentPath>",
    "",
    "Example:",
    '  node scripts/graph/utils/create-folder.js \"01-fundamentos-de-javascript\" \"course\"',
    "",
    "Behavior:",
    "- Creates an empty folder at <parentPath>/<folderName> (recursive).",
    "- Returns the final absolute and relative path as JSON.",
  ].join("\n");
}

function main() {
  const folderName = process.argv[2];
  const parentPathArg = process.argv[3];

  if (!folderName || !parentPathArg) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const parentPath = path.resolve(process.cwd(), parentPathArg);
  const finalPath = path.join(parentPath, folderName);

  fs.mkdirSync(finalPath, { recursive: true });

  process.stdout.write(
    JSON.stringify(
      {
        finalPath: path.resolve(finalPath),
        finalPathRelative: path.relative(process.cwd(), finalPath),
      },
      null,
      2
    ) + "\n"
  );
}

if (require.main === module) main();

