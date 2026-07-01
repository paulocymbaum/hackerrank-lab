import { isValidCourseId, isValidProjectRootPath } from "./api-validation.mjs";
import { runProjectStarter } from "./project-run-lib.mjs";

/**
 * Dev-only Vite plugin: runs starter/index.js with starter/sample.input on stdin.
 */
export function projectRunPlugin(repoRoot) {
  return {
    name: "project-run",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/project-run")) return next();
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }

        try {
          const body = await readJsonBody(req);
          const courseId = body?.courseId;
          const rootPath = body?.rootPath;
          const code = body?.code;
          const sampleInput = body?.sampleInput;

          if (!isValidRunRequest(courseId, rootPath)) {
            res.statusCode = 400;
            res.end("Invalid request");
            return;
          }

          if (code !== undefined && typeof code !== "string") {
            res.statusCode = 400;
            res.end("Invalid code payload");
            return;
          }

          if (sampleInput !== undefined && typeof sampleInput !== "string") {
            res.statusCode = 400;
            res.end("Invalid sample input payload");
            return;
          }

          const result = await runProjectStarter({
            repoRoot,
            rootPath,
            code: typeof code === "string" && code.trim() ? code : undefined,
            sampleInput: typeof sampleInput === "string" ? sampleInput : undefined,
          });

          if (!result.ok) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: result.error }));
            return;
          }

          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              command: result.command,
              stdout: result.stdout,
              stderr: result.stderr,
              exitCode: result.exitCode,
              timedOut: result.timedOut,
            }),
          );
        } catch {
          res.statusCode = 500;
          res.end("Failed to run project starter");
        }
      });
    },
  };
}

function isValidRunRequest(courseId, rootPath) {
  if (!isValidCourseId(courseId)) return false;
  return isValidProjectRootPath(courseId, rootPath);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 256_000) {
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
