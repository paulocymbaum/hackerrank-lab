const fs = require("fs");
const path = require("path");

const MARKER = "cursor:teacher:add-lesson-quiz";
const MIN_ACTIVITIES = 5;
const MAX_ACTIVITIES = 10;

const ALLOWED_TYPES = new Set([
  "predict_output",
  "order_output",
  "stack_trace",
  "multiple_choice",
  "true_false",
  "match_terms",
  "spot_bug",
]);

const PREDICT_TYPES = new Set(["predict_output", "order_output", "stack_trace"]);

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
    "  cat quiz.json | node .cursor/tools/teacher/add-lesson-quiz.js <moduleDir> <lessonFile>",
    "",
    "Examples:",
    "  cat quiz.json | node .cursor/tools/teacher/add-lesson-quiz.js 01-javascript-fundamentals examples/01-truthy-falsy.md",
    "  cat quiz.json | node .cursor/tools/teacher/add-lesson-quiz.js 01-javascript-fundamentals README.md",
    "",
    "Rules:",
    "- Requires course/<moduleDir>/.cursor-created.json",
    "- Writes course/<moduleDir>/quiz/<basename>.quiz.json",
    "- Refuses to overwrite if marker already present (unless --force)",
    "- Validates 5–10 activities and required fields",
  ].join("\n");
}

function quizBasename(lessonFile) {
  const base = path.basename(String(lessonFile));
  if (base === "README.md") return "00-module-overview";
  return base.replace(/\.md$/i, "");
}

function validateActivity(a, index) {
  const label = `activities[${index}]`;
  if (!a || typeof a !== "object") throw new Error(`${label}: must be an object`);
  if (!a.id || typeof a.id !== "string") throw new Error(`${label}: missing id`);
  if (!ALLOWED_TYPES.has(a.type)) {
    throw new Error(`${label}: invalid type "${a.type}"`);
  }
  if (!a.prompt || typeof a.prompt !== "string") {
    throw new Error(`${label}: missing prompt`);
  }
  if (!("answer" in a)) throw new Error(`${label}: missing answer`);
  if (!a.explanation || typeof a.explanation !== "string") {
    throw new Error(`${label}: missing explanation`);
  }

  const needsChoices = !["true_false", "match_terms"].includes(a.type);
  if (needsChoices) {
    if (!Array.isArray(a.choices) || a.choices.length < 2) {
      throw new Error(`${label}: choices required (≥2) for type ${a.type}`);
    }
  }

  if (a.type === "true_false" && typeof a.answer !== "boolean") {
    throw new Error(`${label}: answer must be boolean for true_false`);
  }
  if (a.type === "match_terms") {
    if (!a.answer || typeof a.answer !== "object" || Array.isArray(a.answer)) {
      throw new Error(`${label}: answer must be object for match_terms`);
    }
  }
  if (a.type === "order_output" && !Array.isArray(a.answer)) {
    throw new Error(`${label}: answer must be string[] for order_output`);
  }
}

function validateQuiz(quiz, moduleDir, lessonFile, courseRoot) {
  if (quiz.marker !== MARKER) {
    throw new Error(`marker must be "${MARKER}"`);
  }
  if (!quiz.moduleId || quiz.moduleId !== moduleDir) {
    throw new Error(`moduleId must match module folder: ${moduleDir}`);
  }

  const expectedLessonPath = path.posix.join(courseRoot, moduleDir, lessonFile);
  if (quiz.lessonPath !== expectedLessonPath) {
    throw new Error(
      `lessonPath must be "${expectedLessonPath}" (got "${quiz.lessonPath ?? ""}")`
    );
  }

  if (!quiz.title || typeof quiz.title !== "string") {
    throw new Error("title is required");
  }

  const activities = quiz.activities;
  if (!Array.isArray(activities)) throw new Error("activities must be an array");
  if (activities.length < MIN_ACTIVITIES || activities.length > MAX_ACTIVITIES) {
    throw new Error(
      `activities length must be ${MIN_ACTIVITIES}–${MAX_ACTIVITIES} (got ${activities.length})`
    );
  }

  const ids = new Set();
  let predictCount = 0;
  for (let i = 0; i < activities.length; i++) {
    validateActivity(activities[i], i);
    if (ids.has(activities[i].id)) {
      throw new Error(`duplicate activity id: ${activities[i].id}`);
    }
    ids.add(activities[i].id);
    if (PREDICT_TYPES.has(activities[i].type)) predictCount++;
  }

  if (predictCount < 2) {
    throw new Error(
      "need at least 2 predict-first activities (predict_output, order_output, or stack_trace)"
    );
  }
}

async function main() {
  const moduleDir = process.argv[2];
  const lessonFile = process.argv[3];
  const courseRootArg = process.argv[4] || "course";
  const force = process.argv.includes("--force");

  if (!moduleDir || !lessonFile) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const courseRoot = courseRootArg.replace(/\\/g, "/").replace(/\/$/, "");
  const modulePath = path.join(process.cwd(), courseRoot, moduleDir);
  const markerPath = path.join(modulePath, ".cursor-created.json");

  if (!fs.existsSync(markerPath)) {
    process.stderr.write(
      `Refusing to write: missing marker ${path.relative(process.cwd(), markerPath)}\n`
    );
    process.exit(3);
  }

  const raw = await readStdin();
  let quiz;
  try {
    quiz = JSON.parse(String(raw ?? "").trim());
  } catch (e) {
    process.stderr.write(`Invalid JSON on stdin: ${e.message}\n`);
    process.exit(2);
  }

  const lessonPosix = String(lessonFile).replace(/\\/g, "/").replace(/^\//, "");
  try {
    validateQuiz(quiz, moduleDir, lessonPosix, courseRoot);
  } catch (e) {
    process.stderr.write(`Validation failed: ${e.message}\n`);
    process.exit(2);
  }

  const quizDir = path.join(modulePath, "quiz");
  fs.mkdirSync(quizDir, { recursive: true });

  const outName = `${quizBasename(lessonPosix)}.quiz.json`;
  const outPath = path.join(quizDir, outName);

  if (fs.existsSync(outPath) && !force) {
    const existing = JSON.parse(fs.readFileSync(outPath, "utf8"));
    if (existing.marker === MARKER) {
      process.stdout.write(
        JSON.stringify(
          {
            wroteTo: path.relative(process.cwd(), outPath),
            skipped: true,
            reason: "Quiz file already exists with marker; use --force to overwrite.",
          },
          null,
          2
        ) + "\n"
      );
      return;
    }
  }

  fs.writeFileSync(outPath, `${JSON.stringify(quiz, null, 2)}\n`, "utf8");

  process.stdout.write(
    JSON.stringify(
      {
        wroteTo: path.relative(process.cwd(), outPath),
        activityCount: quiz.activities.length,
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
