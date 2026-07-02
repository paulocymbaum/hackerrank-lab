import type { ProjectRunRepository } from "../../domain/repositories/projectRunRepository";
import type {
  ProjectRunErrorCode,
  ProjectRunOutcome,
  ProjectTestMatrixResult,
} from "../../domain/types/projectRun";

const API_PREFIX = "/api/project-run";

export const httpProjectRunRepository: ProjectRunRepository = {
  async run(courseId, rootPath, code) {
    try {
      const res = await fetch(API_PREFIX, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rootPath, code }),
      });

      if (res.status === 404) {
        const data: unknown = await res.json().catch(() => null);
        const code = parseRunErrorCode(data);
        if (code) return { status: "error", code };
        return { status: "error", code: "unavailable" };
      }

      if (!res.ok) return { status: "error", code: "unavailable" };

      const data: unknown = await res.json();
      if (!isProjectTestMatrixResult(data)) return { status: "error", code: "unavailable" };
      return { status: "ok", matrix: data };
    } catch {
      return null;
    }
  },
};

function parseRunErrorCode(value: unknown): ProjectRunErrorCode | null {
  if (!value || typeof value !== "object") return null;
  const error = (value as { error?: unknown }).error;
  if (error === "missing_tests" || error === "missing_starter" || error === "unavailable") {
    return error;
  }
  if (error === "missing_sample_input") return "missing_tests";
  return null;
}

function isProjectTestMatrixResult(value: unknown): value is ProjectTestMatrixResult {
  if (!value || typeof value !== "object") return false;
  const matrix = value as ProjectTestMatrixResult;
  if (typeof matrix.passedCount !== "number") return false;
  if (typeof matrix.failedCount !== "number") return false;
  if (typeof matrix.totalCount !== "number") return false;
  if (!Array.isArray(matrix.cases)) return false;
  return matrix.cases.every((item) => {
    if (!item || typeof item !== "object") return false;
    return (
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      (item.status === "passed" || item.status === "failed" || item.status === "ran") &&
      typeof item.command === "string" &&
      typeof item.stdin === "string" &&
      typeof item.stdout === "string" &&
      typeof item.stderr === "string" &&
      typeof item.exitCode === "number" &&
      typeof item.timedOut === "boolean"
    );
  });
}
