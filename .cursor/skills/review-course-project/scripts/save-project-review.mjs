#!/usr/bin/env node
/**
 * Save score + comment on a delivery and mark project done when score > 80.
 *
 * Usage:
 *   node save-project-review.mjs <project-path> --score 85 --comment "Well done"
 *   node save-project-review.mjs <project-path> --delivery-id <id> --score 72 --comment "..."
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PROJECT_DELIVERY_FILENAME,
  PROJECT_DELIVERY_PASS_SCORE,
  getLastDeliveries,
  normalizeProjectDeliveryFile,
  passesReview,
  setDeliveryReview,
} from "../../../../frontend/scripts/project-delivery-lib.mjs";
import { validateReviewComment } from "./review-comment.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");
const SCORE_FILE_VERSION = 2;
const PROJECT_POINTS_WEIGHT = 4;

function parseArgs(argv) {
  const args = { projectPath: null, deliveryId: null, score: null, comment: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--delivery-id") args.deliveryId = argv[++i] ?? null;
    else if (arg === "--score") args.score = Number(argv[++i]);
    else if (arg === "--comment") args.comment = argv[++i] ?? null;
    else if (!arg.startsWith("-") && !args.projectPath) args.projectPath = arg.replace(/\/$/, "");
  }
  return args;
}

function resolveProjectPath(inputPath) {
  const abs = path.resolve(repoRoot, inputPath);
  const rel = path.relative(repoRoot, abs);
  if (rel.startsWith("..")) return null;

  const parts = rel.split(path.sep);
  const courseIdx = parts.indexOf("course");
  if (courseIdx < 0) return null;

  const projectsIdx = parts.indexOf("projects");
  if (projectsIdx < 0 || projectsIdx >= parts.length - 1) return null;

  const courseId = parts[courseIdx + 1];
  const projectId = parts[parts.length - 1];
  let lessonId = null;
  const lessonsIdx = parts.indexOf("lessons");
  if (lessonsIdx >= 0 && lessonsIdx < projectsIdx) {
    lessonId = parts[lessonsIdx + 1] ?? null;
  }

  const storageKey = lessonId ? `${lessonId}/${projectId}` : projectId;

  return {
    abs,
    rel,
    courseId,
    projectId,
    lessonId,
    storageKey,
  };
}

async function setProjectDoneInScoreFile(courseId, storageKey) {
  const scorePath = path.join(repoRoot, "course", courseId, "quiz", "score.json");
  let file = {
    version: SCORE_FILE_VERSION,
    courseId,
    updatedAt: new Date().toISOString(),
    quizzes: {},
    projects: {},
  };

  try {
    const raw = await fs.readFile(scorePath, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      file = {
        ...file,
        ...parsed,
        version: SCORE_FILE_VERSION,
        quizzes: parsed.quizzes ?? {},
        projects: parsed.projects ?? {},
      };
    }
  } catch (err) {
    if (!(err && typeof err === "object" && "code" in err && err.code === "ENOENT")) {
      throw err;
    }
  }

  file.updatedAt = new Date().toISOString();
  file.projects = {
    ...file.projects,
    [storageKey]: {
      projectId: storageKey,
      status: "done",
      points: PROJECT_POINTS_WEIGHT,
      updatedAt: file.updatedAt,
    },
  };

  await fs.mkdir(path.dirname(scorePath), { recursive: true });
  await fs.writeFile(scorePath, JSON.stringify(file, null, 2) + "\n", "utf8");
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.projectPath || args.score == null || !args.comment?.trim()) {
    process.stderr.write(
      "Usage: node save-project-review.mjs <project-path> --score <0-100> --comment \"...\" [--delivery-id <id>]\n",
    );
    process.exit(2);
  }

  if (!Number.isFinite(args.score) || args.score < 0 || args.score > 100) {
    process.stderr.write("Score must be an integer from 0 to 100.\n");
    process.exit(2);
  }

  const commentCheck = validateReviewComment(args.comment);
  for (const warning of commentCheck.warnings) {
    process.stderr.write(`WARN: ${warning}\n`);
  }
  if (!commentCheck.ok) {
    process.stderr.write("Invalid review comment:\n");
    for (const error of commentCheck.errors) {
      process.stderr.write(`- ${error}\n`);
    }
    process.stderr.write(
      '\nUse 2–4 plain sentences. Example: "No solution code in the latest delivery yet. Next: read three stdin lines, validate emptiness, parse with Number.isFinite, print JSON or ERROR."\n',
    );
    process.exit(1);
  }

  const resolved = resolveProjectPath(args.projectPath);
  if (!resolved) {
    process.stderr.write("Invalid project path.\n");
    process.exit(2);
  }

  const deliveryPath = path.join(resolved.abs, PROJECT_DELIVERY_FILENAME);
  const raw = await fs.readFile(deliveryPath, "utf8");
  const file = normalizeProjectDeliveryFile(JSON.parse(raw), resolved.courseId, resolved.projectId);

  if (!file || file.deliveries.length === 0) {
    process.stderr.write("No deliveries to review.\n");
    process.exit(1);
  }

  const deliveryId = args.deliveryId ?? getLastDeliveries(file, 1)[0]?.id;
  if (!deliveryId) {
    process.stderr.write("Could not resolve delivery id.\n");
    process.exit(1);
  }

  const next = setDeliveryReview(file, deliveryId, {
    score: Math.round(args.score),
    comment: args.comment.trim(),
  });

  if (!next) {
    process.stderr.write(`Delivery not found: ${deliveryId}\n`);
    process.exit(1);
  }

  await fs.writeFile(deliveryPath, JSON.stringify(next, null, 2) + "\n", "utf8");

  let statusUpdated = false;
  if (passesReview(Math.round(args.score))) {
    await setProjectDoneInScoreFile(resolved.courseId, resolved.storageKey);
    statusUpdated = true;
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        projectPath: resolved.rel,
        deliveryId,
        score: Math.round(args.score),
        passThreshold: PROJECT_DELIVERY_PASS_SCORE,
        passed: passesReview(Math.round(args.score)),
        statusUpdated,
      },
      null,
      2,
    )}\n`,
  );
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
