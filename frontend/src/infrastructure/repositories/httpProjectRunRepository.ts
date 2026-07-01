import type { ProjectRunRepository } from "../../domain/repositories/projectRunRepository";
import type { ProjectRunErrorCode, ProjectRunOutcome, ProjectRunResult } from "../../domain/types/projectRun";

const API_PREFIX = "/api/project-run";

export const httpProjectRunRepository: ProjectRunRepository = {
  async run(courseId, rootPath, code, sampleInput) {
    try {
      const res = await fetch(API_PREFIX, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rootPath, code, sampleInput }),
      });

      if (res.status === 404) {
        const data: unknown = await res.json().catch(() => null);
        const code = parseRunErrorCode(data);
        if (code) return { status: "error", code };
        return { status: "error", code: "unavailable" };
      }

      if (!res.ok) return { status: "error", code: "unavailable" };

      const data: unknown = await res.json();
      if (!isProjectRunResult(data)) return { status: "error", code: "unavailable" };
      return { status: "ok", result: data };
    } catch {
      return null;
    }
  },
};

function parseRunErrorCode(value: unknown): ProjectRunErrorCode | null {
  if (!value || typeof value !== "object") return null;
  const error = (value as { error?: unknown }).error;
  if (error === "missing_sample_input" || error === "missing_starter" || error === "unavailable") {
    return error;
  }
  return null;
}

function isProjectRunResult(value: unknown): value is ProjectRunResult {
  if (!value || typeof value !== "object") return false;
  const result = value as ProjectRunResult;
  return (
    typeof result.command === "string" &&
    typeof result.stdout === "string" &&
    typeof result.stderr === "string" &&
    typeof result.exitCode === "number" &&
    typeof result.timedOut === "boolean"
  );
}
