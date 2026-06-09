import { promises as fs } from "node:fs";
import path from "node:path";
import {
  PROJECT_DELIVERY_FILENAME,
  appendProjectDelivery,
  emptyProjectDeliveryFile,
  normalizeProjectDeliveryFile,
  passesReview,
  setDeliveryReview,
} from "./project-delivery-lib.mjs";
import { isValidCourseId, isValidProjectRootPath } from "./api-validation.mjs";

/**
 * Dev-only Vite plugin: persists project deliveries to
 * course/<courseId>/projects/.../<projectId>/project-delivery.json
 */
export function projectDeliveryPlugin(repoRoot) {
  return {
    name: "project-delivery",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/project-deliveries")) return next();

        if (req.method === "GET") {
          try {
            const parsedUrl = new URL(url, "http://localhost");
            const courseId = parsedUrl.searchParams.get("courseId") ?? "";
            const projectId = parsedUrl.searchParams.get("projectId") ?? "";
            const rootPath = parsedUrl.searchParams.get("rootPath") ?? "";

            if (!isValidRequest(courseId, projectId, rootPath)) {
              res.statusCode = 400;
              res.end("Invalid query parameters");
              return;
            }

            const file = await readDeliveryFile(repoRoot, rootPath, courseId, projectId);
            if (!file) {
              res.statusCode = 404;
              res.end("Not found");
              return;
            }

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(file));
          } catch {
            res.statusCode = 500;
            res.end("Failed to read project-delivery.json");
          }
          return;
        }

        if (req.method === "POST") {
          try {
            const body = await readJsonBody(req);
            const courseId = body?.courseId;
            const projectId = body?.projectId;
            const rootPath = body?.rootPath;

            if (!isValidRequest(courseId, projectId, rootPath)) {
              res.statusCode = 400;
              res.end("Invalid request");
              return;
            }

            let nextFile;

            if (body?.kind === "review") {
              nextFile = await saveReview(repoRoot, rootPath, courseId, projectId, body);
              if (!nextFile) {
                res.statusCode = 400;
                res.end("Invalid review payload");
                return;
              }
              if (passesReview(body.score)) {
                await setProjectDoneInScoreFile(repoRoot, courseId, projectId);
              }
            } else {
              const content = body?.content;
              if (typeof content !== "string" || !content.trim()) {
                res.statusCode = 400;
                res.end("Invalid payload");
                return;
              }
              nextFile = await appendDelivery(repoRoot, rootPath, courseId, projectId, content);
            }

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(nextFile));
          } catch {
            res.statusCode = 500;
            res.end("Failed to write project-delivery.json");
          }
          return;
        }

        res.statusCode = 405;
        res.end("Method not allowed");
      });
    },
  };
}

async function readDeliveryFile(repoRoot, rootPath, courseId, projectId) {
  const deliveryPath = resolveDeliveryPath(repoRoot, rootPath);
  try {
    const raw = await fs.readFile(deliveryPath, "utf8");
    const parsed = JSON.parse(raw);
    return normalizeProjectDeliveryFile(parsed, courseId, projectId);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

async function loadOrEmpty(repoRoot, rootPath, courseId, projectId) {
  return (await readDeliveryFile(repoRoot, rootPath, courseId, projectId)) ??
    emptyProjectDeliveryFile({ courseId, projectId });
}

async function writeDeliveryFile(repoRoot, rootPath, file) {
  const deliveryPath = resolveDeliveryPath(repoRoot, rootPath);
  await fs.mkdir(path.dirname(deliveryPath), { recursive: true });
  await fs.writeFile(deliveryPath, JSON.stringify(file, null, 2) + "\n", "utf8");
  return file;
}

async function appendDelivery(repoRoot, rootPath, courseId, projectId, content) {
  const file = await loadOrEmpty(repoRoot, rootPath, courseId, projectId);
  const next = appendProjectDelivery(file, content);
  return writeDeliveryFile(repoRoot, rootPath, next);
}

async function saveReview(repoRoot, rootPath, courseId, projectId, body) {
  const deliveryId = body?.deliveryId;
  const score = body?.score;
  const comment = body?.comment;

  if (typeof deliveryId !== "string" || typeof score !== "number" || typeof comment !== "string") {
    return null;
  }

  const file = await readDeliveryFile(repoRoot, rootPath, courseId, projectId);
  if (!file) return null;

  const next = setDeliveryReview(file, deliveryId, { score, comment });
  if (!next) return null;

  return writeDeliveryFile(repoRoot, rootPath, next);
}

async function setProjectDoneInScoreFile(repoRoot, courseId, projectId) {
  const scorePath = path.join(repoRoot, "course", courseId, "quiz", "score.json");
  const PROJECT_POINTS_WEIGHT = 4;

  let file = {
    version: 2,
    courseId,
    updatedAt: new Date().toISOString(),
    quizzes: {},
    projects: {},
  };

  try {
    const raw = await fs.readFile(scorePath, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") file = { ...file, ...parsed, version: 2 };
  } catch (err) {
    if (!(err && typeof err === "object" && "code" in err && err.code === "ENOENT")) {
      throw err;
    }
  }

  file.updatedAt = new Date().toISOString();
  file.projects = {
    ...(file.projects ?? {}),
    [projectId]: {
      projectId,
      status: "done",
      points: PROJECT_POINTS_WEIGHT,
      updatedAt: file.updatedAt,
    },
  };

  await fs.mkdir(path.dirname(scorePath), { recursive: true });
  await fs.writeFile(scorePath, JSON.stringify(file, null, 2) + "\n", "utf8");
}

function isValidRequest(courseId, projectId, rootPath) {
  if (!isValidCourseId(courseId)) return false;
  if (typeof projectId !== "string" || !projectId.trim()) return false;
  return isValidProjectRootPath(courseId, rootPath);
}

function resolveDeliveryPath(repoRoot, rootPath) {
  return path.join(repoRoot, rootPath, PROJECT_DELIVERY_FILENAME);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 65_536) {
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
