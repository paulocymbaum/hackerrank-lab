import type { ReaderEntry } from "../../domain/types/reader";
import { normalizeSampleInput, PROJECT_SAMPLE_INPUT_PATH } from "./projectSampleInput";

export const PROJECT_TESTS_JSON_PATH = "starter/tests.json";

export type ProjectTestCase = {
  id: string;
  name: string;
  stdin: string;
  expectedStdout?: string;
  expectedExitCode?: number;
};

export function normalizeTestOutput(text: string): string {
  return text.replace(/\r\n/g, "\n").trimEnd();
}

export function parseTestsJson(raw: string): { cases: ProjectTestCase[] } | null {
  if (!raw.trim()) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  const source = Array.isArray(parsed) ? parsed : (parsed as { cases?: unknown })?.cases;
  if (!Array.isArray(source) || source.length === 0) return null;

  const cases: ProjectTestCase[] = [];
  for (let index = 0; index < source.length; index += 1) {
    const item = source[index];
    if (!item || typeof item !== "object") return null;

    const record = item as Record<string, unknown>;
    const stdin = typeof record.stdin === "string" ? record.stdin : "";
    const id =
      typeof record.id === "string" && record.id.trim()
        ? record.id.trim()
        : `case-${String(index + 1).padStart(2, "0")}`;
    const name =
      typeof record.name === "string" && record.name.trim() ? record.name.trim() : id;

    const testCase: ProjectTestCase = { id, name, stdin };
    if (typeof record.expectedStdout === "string") {
      testCase.expectedStdout = record.expectedStdout;
    }
    if (typeof record.expectedExitCode === "number" && Number.isFinite(record.expectedExitCode)) {
      testCase.expectedExitCode = record.expectedExitCode;
    }
    cases.push(testCase);
  }

  return cases.length > 0 ? { cases } : null;
}

export function getProjectTestCases(entries: ReaderEntry[]): ProjectTestCase[] | null {
  const testsFile = entries.find(
    (entry) => entry.kind === "file" && entry.path === PROJECT_TESTS_JSON_PATH,
  );
  if (testsFile?.content) {
    const parsed = parseTestsJson(testsFile.content);
    if (parsed?.cases.length) return parsed.cases;
  }

  const sampleFile = entries.find(
    (entry) => entry.kind === "file" && entry.path === PROJECT_SAMPLE_INPUT_PATH,
  );
  if (sampleFile?.content !== undefined) {
    return [{ id: "sample", name: "Sample", stdin: normalizeSampleInput(sampleFile.content) }];
  }

  return null;
}

export function hasProjectTestCases(entries: ReaderEntry[]): boolean {
  return getProjectTestCases(entries) !== null;
}

export function evaluateTestCase(
  testCase: ProjectTestCase,
  runResult: { stdout: string; exitCode: number; timedOut: boolean },
): { status: "passed" | "failed" | "ran"; failureReason: string | null } {
  const hasStdoutExpectation = typeof testCase.expectedStdout === "string";
  const hasExitExpectation = typeof testCase.expectedExitCode === "number";

  if (!hasStdoutExpectation && !hasExitExpectation) {
    return { status: "ran", failureReason: null };
  }

  if (runResult.timedOut) {
    return { status: "failed", failureReason: "timeout" };
  }

  let failureReason: string | null = null;

  if (hasExitExpectation && runResult.exitCode !== testCase.expectedExitCode) {
    failureReason = "exit_code";
  }

  if (
    hasStdoutExpectation &&
    normalizeTestOutput(runResult.stdout) !== normalizeTestOutput(testCase.expectedStdout!)
  ) {
    failureReason = failureReason ?? "stdout_mismatch";
  }

  return {
    status: failureReason ? "failed" : "passed",
    failureReason,
  };
}
