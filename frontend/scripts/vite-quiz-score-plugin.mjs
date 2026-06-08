import { promises as fs } from "node:fs";
import path from "node:path";

const SCORE_FILE_VERSION = 2;
const SCORE_FILE_VERSION_LEGACY = 1;
const PROJECT_POINTS_WEIGHT = 4;
const PROJECT_STATUSES = new Set(["pending", "doing", "done"]);

/**
 * Dev-only Vite plugin: persists quiz attempts and project status to course/<courseId>/quiz/score.json.
 */
export function quizScorePlugin(repoRoot) {
  return {
    name: "quiz-score",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        const match = url.match(/^\/api\/quiz-scores\/([^/?#]+)/);
        if (!match) return next();

        const courseId = decodeURIComponent(match[1]);
        if (!/^\d{2}-[\w-]+$/.test(courseId)) {
          res.statusCode = 400;
          res.end("Invalid course id");
          return;
        }

        const scorePath = path.join(repoRoot, "course", courseId, "quiz", "score.json");

        if (req.method === "GET") {
          try {
            const raw = await fs.readFile(scorePath, "utf8");
            const parsed = JSON.parse(raw);
            const normalized = normalizeCourseScoreFile(parsed, courseId);
            if (!normalized) {
              res.statusCode = 500;
              res.end("Invalid score.json");
              return;
            }
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(normalized));
          } catch (err) {
            if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
              res.statusCode = 404;
              res.end("Not found");
              return;
            }
            res.statusCode = 500;
            res.end("Failed to read score.json");
          }
          return;
        }

        if (req.method === "POST") {
          try {
            const body = await readJsonBody(req);
            let file = emptyCourseScoreFile(courseId);
            try {
              const raw = await fs.readFile(scorePath, "utf8");
              const parsed = JSON.parse(raw);
              const normalized = normalizeCourseScoreFile(parsed, courseId);
              if (normalized) file = normalized;
            } catch (err) {
              if (!(err && typeof err === "object" && "code" in err && err.code === "ENOENT")) {
                throw err;
              }
            }

            let next = file;

            if (body?.kind === "project") {
              const projectId = body?.projectId;
              const status = body?.status;
              if (typeof projectId !== "string" || !PROJECT_STATUSES.has(status)) {
                res.statusCode = 400;
                res.end("Invalid project payload");
                return;
              }
              next = setProjectStatusInFile(file, projectId, status);
            } else {
              const quizId = body?.quizId;
              const attempt = body?.attempt;
              if (
                typeof quizId !== "string" ||
                !attempt ||
                typeof attempt.score !== "number" ||
                typeof attempt.total !== "number" ||
                typeof attempt.completedAt !== "string"
              ) {
                res.statusCode = 400;
                res.end("Invalid quiz payload");
                return;
              }
              next = appendQuizAttempt(file, quizId, attempt);
            }

            await fs.mkdir(path.dirname(scorePath), { recursive: true });
            await fs.writeFile(scorePath, JSON.stringify(next, null, 2) + "\n", "utf8");

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(next));
          } catch {
            res.statusCode = 500;
            res.end("Failed to write score.json");
          }
          return;
        }

        res.statusCode = 405;
        res.end("Method not allowed");
      });
    },
  };
}

function emptyCourseScoreFile(courseId) {
  return {
    version: SCORE_FILE_VERSION,
    courseId,
    updatedAt: new Date().toISOString(),
    quizzes: {},
    projects: {},
  };
}

function normalizeCourseScoreFile(value, courseId) {
  if (!value || typeof value !== "object") return null;
  const version = value.version;
  if (version !== SCORE_FILE_VERSION && version !== SCORE_FILE_VERSION_LEGACY) return null;
  if (typeof value.courseId !== "string") return null;
  if (courseId && value.courseId !== courseId) return null;
  if (!value.quizzes || typeof value.quizzes !== "object") return null;
  if (!Object.values(value.quizzes).every(isValidQuizScoreEntry)) return null;

  const projects = value.projects && typeof value.projects === "object" ? value.projects : {};
  if (!Object.values(projects).every(isValidProjectScoreEntry)) return null;

  return {
    version: SCORE_FILE_VERSION,
    courseId: value.courseId,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
    quizzes: value.quizzes,
    projects,
  };
}

function isValidQuizScoreEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  if (typeof entry.quizId !== "string") return false;
  if (typeof entry.bestScore !== "number" || typeof entry.bestTotal !== "number") return false;
  if (!Array.isArray(entry.attempts)) return false;
  return entry.attempts.every(
    (attempt) =>
      attempt &&
      typeof attempt.score === "number" &&
      typeof attempt.total === "number" &&
      typeof attempt.completedAt === "string",
  );
}

function isValidProjectScoreEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  if (typeof entry.projectId !== "string") return false;
  if (!PROJECT_STATUSES.has(entry.status)) return false;
  if (typeof entry.points !== "number") return false;
  return typeof entry.updatedAt === "string";
}

function appendQuizAttempt(file, quizId, attempt) {
  const prev = file.quizzes[quizId];
  const attempts = [...(prev?.attempts ?? []), attempt];
  return {
    ...file,
    version: SCORE_FILE_VERSION,
    updatedAt: new Date().toISOString(),
    quizzes: {
      ...file.quizzes,
      [quizId]: {
        quizId,
        bestScore: Math.max(prev?.bestScore ?? 0, attempt.score),
        bestTotal: attempt.total,
        attempts,
      },
    },
    projects: file.projects ?? {},
  };
}

function setProjectStatusInFile(file, projectId, status) {
  return {
    ...file,
    version: SCORE_FILE_VERSION,
    updatedAt: new Date().toISOString(),
    projects: {
      ...(file.projects ?? {}),
      [projectId]: {
        projectId,
        status,
        points: status === "done" ? PROJECT_POINTS_WEIGHT : 0,
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 32_768) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : null);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}
