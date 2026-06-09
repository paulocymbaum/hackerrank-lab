#!/usr/bin/env node
/**
 * Collect project README, last 3 deliveries (ordered), and starter code for review.
 *
 * Usage:
 *   node collect-project-review-context.mjs <project-path>
 *   node collect-project-review-context.mjs course/01-.../projects/topic/001-project
 *   node collect-project-review-context.mjs course/01-.../projects/topic/001-project --format json
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PROJECT_DELIVERY_FILENAME,
  getLastDeliveries,
  normalizeProjectDeliveryFile,
} from "../../../../frontend/scripts/project-delivery-lib.mjs";
import {
  COMMENT_EXAMPLES,
  COMMENT_TEMPLATE,
  MAX_REVIEW_COMMENT_LENGTH,
  MAX_REVIEW_COMMENT_LINES,
} from "./review-comment.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");
const MAX_FILE_BYTES = 200_000;
const CODE_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx"]);
const SKIP_CODE_FILES = new Set(["project-delivery.json"]);

function parseArgs(argv) {
  const args = { format: "markdown", out: null, projectPath: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--format") args.format = argv[++i] ?? "markdown";
    else if (arg === "--out") args.out = argv[++i] ?? null;
    else if (!arg.startsWith("-")) args.projectPath = arg.replace(/\/$/, "");
  }
  return args;
}

async function readTextSafe(filePath) {
  try {
    const stat = await fs.stat(filePath);
    if (stat.size > MAX_FILE_BYTES) return `[skipped: exceeds ${MAX_FILE_BYTES} bytes]`;
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function listDirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function collectCodeFiles(dir, relPrefix = "") {
  const files = [];
  const entries = await listDirSafe(dir);

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const abs = path.join(dir, entry.name);
    const rel = relPrefix ? path.posix.join(relPrefix, entry.name) : entry.name;

    if (entry.isDirectory()) {
      files.push(...(await collectCodeFiles(abs, rel)));
      continue;
    }

    if (!entry.isFile()) continue;
    if (SKIP_CODE_FILES.has(entry.name.toLowerCase())) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!CODE_EXTENSIONS.has(ext)) continue;

    const content = await readTextSafe(abs);
    if (content.trim()) files.push({ path: rel, content });
  }

  return files;
}

function resolveProjectPath(inputPath) {
  const abs = path.resolve(repoRoot, inputPath);
  const rel = path.relative(repoRoot, abs);
  if (rel.startsWith("..")) return null;

  const parts = rel.split(path.sep);
  const courseIdx = parts.indexOf("course");
  if (courseIdx < 0 || parts.length < courseIdx + 5) return null;
  if (parts[courseIdx + 2] !== "projects") return null;

  const courseId = parts[courseIdx + 1];
  const projectId = parts[parts.length - 1];
  const rootPath = parts.slice(courseIdx, parts.length).join("/");

  return { abs, rel, courseId, projectId, rootPath };
}

async function collectContext(projectPathInput) {
  const resolved = resolveProjectPath(projectPathInput);
  if (!resolved) throw new Error("Invalid project path");

  const readme = await readTextSafe(path.join(resolved.abs, "README.md"));
  const moduleReadme = await readTextSafe(
    path.join(repoRoot, "course", resolved.courseId, "README.md"),
  );
  const deliveryRaw = await readTextSafe(path.join(resolved.abs, PROJECT_DELIVERY_FILENAME));
  let deliveryFile = null;

  if (deliveryRaw.trim()) {
    deliveryFile = normalizeProjectDeliveryFile(
      JSON.parse(deliveryRaw),
      resolved.courseId,
      resolved.projectId,
    );
  }

  const lastThree = deliveryFile ? getLastDeliveries(deliveryFile, 3) : [];
  const orderedDeliveries = lastThree.map((entry, index) => ({
    orderLabel: `Delivery ${index + 1} of ${lastThree.length} (chronological)`,
    sequence: index + 1,
    totalInWindow: lastThree.length,
    isLatest: index === lastThree.length - 1,
    id: entry.id,
    submittedAt: entry.submittedAt,
    content: entry.content,
    review: entry.review ?? null,
  }));

  const starterFiles = await collectCodeFiles(path.join(resolved.abs, "starter"), "starter");
  const solutionFiles = await collectCodeFiles(path.join(resolved.abs, "solution"), "solution");

  return {
    courseId: resolved.courseId,
    projectId: resolved.projectId,
    rootPath: resolved.rootPath,
    projectPath: resolved.rel,
    readme,
    moduleReadme,
    deliveryCount: deliveryFile?.deliveries.length ?? 0,
    orderedDeliveries,
    latestDeliveryId: orderedDeliveries.at(-1)?.id ?? null,
    starterFiles,
    solutionFiles,
    gradingRules: {
      scoreRange: "0-100 integer",
      passThreshold: 80,
      passCondition: "score > 80 sets project status to done",
      reviewTarget: "Attach review to the latest delivery in the window (or --delivery-id)",
      inScope: [
        "Module lesson context (module README concepts)",
        "Project README acceptance criteria and requirements",
        "Student code in starter/",
        "Delivery text only as technical explanation of the solution",
      ],
      outOfScope: [
        "Study app UI, Delivery tab, project-delivery.json mechanics",
        "score.json, catalog, frontend/repo architecture",
        "Using the delivery feature correctly",
        "Repo tooling and skills (never mention in student comment)",
      ],
      commentRules: {
        maxChars: MAX_REVIEW_COMMENT_LENGTH,
        maxLines: MAX_REVIEW_COMMENT_LINES,
        format: COMMENT_TEMPLATE,
        examples: COMMENT_EXAMPLES,
      },
    },
  };
}

function formatMarkdown(ctx) {
  const lines = [
    `# Project review context — ${ctx.projectId}`,
    "",
    `- **Course**: \`${ctx.courseId}\``,
    `- **Project path**: \`${ctx.projectPath}\``,
    `- **Root path**: \`${ctx.rootPath}\``,
    `- **Total deliveries**: ${ctx.deliveryCount}`,
    `- **Latest delivery id**: \`${ctx.latestDeliveryId ?? "none"}\``,
    "",
    "## Review scope (STRICT)",
    "",
    "**Grade only:** module lesson concepts, project README criteria, `starter/` code, and delivery text that explains the **exercise solution**.",
    "",
    "**Do not mention in the comment:** study app UI, Delivery tab, `project-delivery.json`, delivery workflow, catalog/frontend architecture, or repo tooling.",
    "",
    "## Grading rules",
    "",
    "- Score: integer **0–100** on the reviewed delivery",
    "- Pass: **score > 80** → project marked done in course progress",
    "- Compare work against **Acceptance criteria** and **Functional requirements** in the project README",
    "- Tie feedback to **module concepts** below when relevant",
    "",
    "## Comment format (STRICT — shown in Delivery tab)",
    "",
    `- **Max ${MAX_REVIEW_COMMENT_LENGTH} characters**, **max ${MAX_REVIEW_COMMENT_LINES} lines**`,
    "- Plain sentences only — no `**Section:**` headers or long bullet lists",
    `- Template: ${COMMENT_TEMPLATE}`,
    "",
    "**Good pass example:**",
    "",
    `"${COMMENT_EXAMPLES.pass}"`,
    "",
    "**Good fail example:**",
    "",
    `"${COMMENT_EXAMPLES.failNoCode}"`,
    "",
    "## Module lesson context",
    "",
    ctx.moduleReadme || "_missing module README.md_",
    "",
    "## Project README",
    "",
    ctx.readme || "_missing README.md_",
    "",
    "## Last deliveries (oldest → newest, max 3)",
    "",
  ];

  if (ctx.orderedDeliveries.length === 0) {
    lines.push("_No delivery write-ups yet — grade from `starter/` code and README only._", "");
  } else {
    for (const delivery of ctx.orderedDeliveries) {
      lines.push(`### ${delivery.orderLabel}`);
      lines.push("");
      lines.push(`- **id**: \`${delivery.id}\``);
      lines.push(`- **submittedAt**: ${delivery.submittedAt}`);
      lines.push(`- **isLatest**: ${delivery.isLatest}`);
      if (delivery.review) {
        lines.push(`- **existing review**: score ${delivery.review.score} — ${delivery.review.comment}`);
      }
      lines.push("");
      lines.push("```markdown");
      lines.push(delivery.content);
      lines.push("```");
      lines.push("");
      lines.push("_Use delivery text only if it explains the solution; ignore non-technical placeholders._");
      lines.push("");
    }
  }

  lines.push("## Starter code", "");
  if (ctx.starterFiles.length === 0) {
    lines.push("_No starter files found._", "");
  } else {
    for (const file of ctx.starterFiles) {
      lines.push(`### \`${file.path}\``, "", "```javascript", file.content, "```", "");
    }
  }

  lines.push("## Solution reference (do not copy to student)", "");
  if (ctx.solutionFiles.length === 0) {
    lines.push("_No solution files._", "");
  } else {
    for (const file of ctx.solutionFiles) {
      lines.push(`### \`${file.path}\``, "", "```javascript", file.content, "```", "");
    }
  }

  lines.push("## Save review", "", "Write a **short** comment first, then run:", "", "```bash");
  lines.push(
    `node .cursor/skills/review-course-project/scripts/save-project-review.mjs ${ctx.projectPath} --score <0-100> --comment "<2-4 sentences>"`,
  );
  lines.push("```", "");
  lines.push("_Script rejects comments over 480 chars, over 5 lines, or with banned platform/tooling phrases._", "");

  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.projectPath) {
    process.stderr.write(
      "Usage: node collect-project-review-context.mjs course/<module>/projects/<topic>/<project>\n",
    );
    process.exit(2);
  }

  const ctx = await collectContext(args.projectPath);
  const output = args.format === "json" ? JSON.stringify(ctx, null, 2) : formatMarkdown(ctx);

  if (args.out) {
    await fs.writeFile(path.resolve(args.out), output, "utf8");
    process.stderr.write(`Wrote ${args.out}\n`);
  } else {
    process.stdout.write(`${output}\n`);
  }
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
