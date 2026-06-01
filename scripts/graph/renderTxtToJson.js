const fs = require("fs");
const path = require("path");
const { parseMindmapText } = require("./parseMindmap");

function usage() {
  const cmd = path.basename(process.argv[1]);
  return [
    `Usage: node scripts/graph/${cmd} <inputTxt> [outputJson]`,
    ``,
    `Examples:`,
    `  node scripts/graph/${cmd} graph/course.graph.txt`,
    `  node scripts/graph/${cmd} graph/course.graph.txt graph/course.graph.json`,
  ].join("\n");
}

function main() {
  const input = process.argv[2];
  const output = process.argv[3];

  if (!input) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const inputPath = path.resolve(process.cwd(), input);
  const text = fs.readFileSync(inputPath, "utf8");
  const graph = parseMindmapText(text);
  const json = JSON.stringify(graph, null, 2);

  if (output) {
    const outPath = path.resolve(process.cwd(), output);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, json, "utf8");
  } else {
    process.stdout.write(`${json}\n`);
  }
}

if (require.main === module) main();

module.exports = { main };

