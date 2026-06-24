#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import {
  loadGraph,
  extractIndexPath,
  stripIndexPrefix,
  slugFromLabel,
  findNodeByIndex,
  isLeafNode,
  getLeafDescendants,
  getModuleIndex,
  defaultCourseSlug,
} from "./graph-index.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const createFolderTool = path.join(repoRoot, "scripts/graph/utils/create-folder.js");
const injectTool = path.join(repoRoot, "scripts/graph/utils/inject-markdown-file.js");

function parseArgs(argv) {
  const args = { module: null, dryRun: false, course: null, scaffoldLeaves: true, index: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--module") args.module = argv[++i];
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--course") args.course = argv[++i];
    else if (arg === "--no-leaves") args.scaffoldLeaves = false;
    else if (!arg.startsWith("-")) args.index = arg;
  }
  return args;
}

function runCreateFolder(folderName, parentPath) {
  execFileSync("node", [createFolderTool, folderName, parentPath], { stdio: ["ignore", "pipe", "inherit"] });
}

function writeFileExact(fileName, dirPath, content) {
  execFileSync("node", [injectTool, fileName, dirPath, content], { stdio: ["ignore", "pipe", "inherit"] });
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function lessonReadmeSkeleton(title, graphIndex) {
  return [
    `# ${title}`,
    "",
    `> Graph index: \`${graphIndex}\``,
    "",
    "## Context",
    "",
    "## Predict first",
    "",
    "## Explanation",
    "",
    "## What to observe",
    "",
    "## Quick challenge",
    "",
  ].join("\n");
}

function moduleReadmeSkeleton(title, graphIndex) {
  return [
    `# ${title}`,
    "",
    `> Graph index: \`${graphIndex}\``,
    "",
    "## Motivation",
    "",
    "## Lesson map",
    "",
    "## Checklist",
    "",
  ].join("\n");
}

function courseReadmeSkeleton(title) {
  return [`# ${title}`, "", "## Overview", "", "## Modules", "", "## How to study", ""].join("\n");
}

async function ensureCourse(graph, courseSlug, dryRun) {
  const coursePath = path.join(repoRoot, "course", courseSlug);
  const rootNode = graph.nodes.find((n) => n.id === graph.rootId);
  const meta = {
    id: courseSlug,
    graphRootLabel: rootNode?.label ?? "JavaScript",
    title: stripIndexPrefix(rootNode?.label ?? "JavaScript") || "JavaScript",
  };

  const result = { courseSlug, coursePath: path.relative(repoRoot, coursePath), created: [], skipped: [] };

  if (dryRun) {
    result.planned = ["README.md", "course.meta.json", "modules/"];
    return result;
  }

  runCreateFolder(courseSlug, path.join(repoRoot, "course"));
  runCreateFolder("modules", coursePath);

  const readmePath = path.join(coursePath, "README.md");
  if (!(await fileExists(readmePath))) {
    writeFileExact("README.md", coursePath, courseReadmeSkeleton(meta.title));
    result.created.push("README.md");
  } else {
    result.skipped.push("README.md");
  }

  const metaPath = path.join(coursePath, "course.meta.json");
  if (!(await fileExists(metaPath))) {
    writeFileExact("course.meta.json", coursePath, JSON.stringify(meta, null, 2));
    result.created.push("course.meta.json");
  } else {
    result.skipped.push("course.meta.json");
  }

  return result;
}

async function scaffoldModule(graph, moduleNode, courseSlug, dryRun, scaffoldLeaves) {
  const graphIndex = extractIndexPath(moduleNode.label);
  const moduleId = slugFromLabel(moduleNode.label);
  const moduleTitle = stripIndexPrefix(moduleNode.label);
  const coursePath = path.join(repoRoot, "course", courseSlug);
  const modulesPath = path.join(coursePath, "modules");
  const modulePath = path.join(modulesPath, moduleId);

  const result = {
    kind: "module",
    moduleId,
    graphIndex,
    modulePath: path.relative(repoRoot, modulePath),
    created: [],
    skipped: [],
    lessons: [],
  };

  if (dryRun) {
    result.planned = [
      "README.md",
      "module.meta.json",
      "lessons/",
      ...(scaffoldLeaves ? getLeafDescendants(graph, moduleNode.id).map((n) => slugFromLabel(n.label)) : []),
    ];
    return result;
  }

  await ensureCourse(graph, courseSlug, false);
  runCreateFolder(moduleId, modulesPath);
  runCreateFolder("lessons", modulePath);

  const meta = {
    id: moduleId,
    graphIndex,
    graphNodeId: moduleNode.id,
    title: moduleTitle,
  };

  const marker = {
    createdBy: "cursor-tool",
    tool: "scripts/graph/scaffold-from-graph.mjs",
    createdAt: new Date().toISOString(),
    kind: "module",
    moduleId,
    graphIndex,
  };

  const readmePath = path.join(modulePath, "README.md");
  if (!(await fileExists(readmePath))) {
    writeFileExact("README.md", modulePath, moduleReadmeSkeleton(moduleTitle, graphIndex));
    result.created.push("README.md");
  } else {
    result.skipped.push("README.md");
  }

  const metaPath = path.join(modulePath, "module.meta.json");
  if (!(await fileExists(metaPath))) {
    writeFileExact("module.meta.json", modulePath, JSON.stringify(meta, null, 2));
    result.created.push("module.meta.json");
  } else {
    result.skipped.push("module.meta.json");
  }

  if (!(await fileExists(path.join(modulePath, ".cursor-created.json")))) {
    writeFileExact(".cursor-created.json", modulePath, JSON.stringify(marker, null, 2));
    result.created.push(".cursor-created.json");
  }

  if (scaffoldLeaves) {
    const leaves = getLeafDescendants(graph, moduleNode.id);
    for (const leaf of leaves) {
      result.lessons.push(await scaffoldLesson(graph, leaf, courseSlug, moduleId, false));
    }
  }

  return result;
}

async function scaffoldLesson(graph, lessonNode, courseSlug, moduleId, dryRun) {
  const graphIndex = extractIndexPath(lessonNode.label);
  const lessonId = slugFromLabel(lessonNode.label);
  const lessonTitle = stripIndexPrefix(lessonNode.label);
  const modulePath = path.join(repoRoot, "course", courseSlug, "modules", moduleId);
  const lessonsPath = path.join(modulePath, "lessons");
  const lessonPath = path.join(lessonsPath, lessonId);

  const result = {
    kind: "lesson",
    lessonId,
    graphIndex,
    lessonPath: path.relative(repoRoot, lessonPath),
    created: [],
    skipped: [],
  };

  if (dryRun) {
    result.planned = ["README.md", "lesson.meta.json", "projects/", "quiz/", ".cursor-created.json"];
    return result;
  }

  if (!(await fileExists(modulePath))) {
    const moduleNode = findNodeByIndex(graph, getModuleIndex(graphIndex));
    if (moduleNode) await scaffoldModule(graph, moduleNode, courseSlug, false, false);
  }

  runCreateFolder(lessonId, lessonsPath);
  runCreateFolder("projects", lessonPath);
  runCreateFolder("quiz", lessonPath);

  const meta = {
    id: lessonId,
    graphIndex,
    graphNodeId: lessonNode.id,
    title: lessonTitle,
    prerequisites: [],
    status: "draft",
  };

  const marker = {
    createdBy: "cursor-tool",
    tool: "scripts/graph/scaffold-from-graph.mjs",
    createdAt: new Date().toISOString(),
    kind: "lesson",
    lessonId,
    moduleId,
    graphIndex,
  };

  const readmePath = path.join(lessonPath, "README.md");
  if (!(await fileExists(readmePath))) {
    writeFileExact("README.md", lessonPath, lessonReadmeSkeleton(lessonTitle, graphIndex));
    result.created.push("README.md");
  } else {
    result.skipped.push("README.md");
  }

  const metaPath = path.join(lessonPath, "lesson.meta.json");
  if (!(await fileExists(metaPath))) {
    writeFileExact("lesson.meta.json", lessonPath, JSON.stringify(meta, null, 2));
    result.created.push("lesson.meta.json");
  } else {
    result.skipped.push("lesson.meta.json");
  }

  const markerPath = path.join(lessonPath, ".cursor-created.json");
  if (!(await fileExists(markerPath))) {
    writeFileExact(".cursor-created.json", lessonPath, JSON.stringify(marker, null, 2));
    result.created.push(".cursor-created.json");
  }

  return result;
}

async function main() {
  const args = parseArgs(process.argv);
  const graph = loadGraph({ repoRoot });

  if (!args.module && !args.index) {
    process.stderr.write(
      'Usage: scaffold-from-graph.mjs "<graphIndex>" | --module "<NN>" [--dry-run] [--course <slug>] [--no-leaves]\n',
    );
    process.exit(2);
  }

  const courseSlug = args.course || defaultCourseSlug(graph);
  let output;

  if (args.module) {
    const moduleNode = findNodeByIndex(graph, args.module);
    if (!moduleNode) {
      process.stderr.write(`NOT_FOUND: module index ${args.module}\n`);
      process.exit(1);
    }
    output = await scaffoldModule(graph, moduleNode, courseSlug, args.dryRun, args.scaffoldLeaves);
  } else {
    const node = findNodeByIndex(graph, args.index);
    if (!node) {
      process.stderr.write(`NOT_FOUND: index ${args.index}\n`);
      process.exit(1);
    }

    if (!isLeafNode(graph, node.id)) {
      const moduleIndex = extractIndexPath(node.label);
      if (moduleIndex && moduleIndex.split(".").length === 1) {
        output = await scaffoldModule(graph, node, courseSlug, args.dryRun, args.scaffoldLeaves);
      } else {
        process.stderr.write(`NOT_A_LEAF: ${args.index} — use --module for sections or a leaf index.\n`);
        process.exit(1);
      }
    } else {
      const moduleId = slugFromLabel(findNodeByIndex(graph, getModuleIndex(args.index)).label);
      output = await scaffoldLesson(graph, node, courseSlug, moduleId, args.dryRun);
    }
  }

  process.stdout.write(JSON.stringify({ courseSlug, dryRun: args.dryRun, ...output }, null, 2) + "\n");
}

main().catch((err) => {
  process.stderr.write(String(err?.stack || err) + "\n");
  process.exit(1);
});
