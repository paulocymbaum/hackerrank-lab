export const PROJECT_TESTS_JSON_REL = "starter/tests.json";
export const PROJECT_SAMPLE_INPUT_REL = "starter/sample.input";
export const PROJECT_STARTER_ENTRY_REL = "starter/index.js";

export function normalizeTestOutput(text) {
  return String(text ?? "").replace(/\r\n/g, "\n").trimEnd();
}

/**
 * @param {string} raw
 * @returns {{ cases: Array<{ id: string; name: string; stdin: string; expectedStdout?: string; expectedExitCode?: number }> } | null}
 */
export function parseTestsJson(raw) {
  if (!raw?.trim()) return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  const source = Array.isArray(parsed) ? parsed : parsed?.cases;
  if (!Array.isArray(source) || source.length === 0) return null;

  const cases = [];
  for (let index = 0; index < source.length; index += 1) {
    const item = source[index];
    if (!item || typeof item !== "object") return null;

    const stdin = typeof item.stdin === "string" ? item.stdin : "";
    const id =
      typeof item.id === "string" && item.id.trim()
        ? item.id.trim()
        : `case-${String(index + 1).padStart(2, "0")}`;
    const name =
      typeof item.name === "string" && item.name.trim() ? item.name.trim() : id;

    const testCase = { id, name, stdin };
    if (typeof item.expectedStdout === "string") {
      testCase.expectedStdout = item.expectedStdout;
    }
    if (typeof item.expectedExitCode === "number" && Number.isFinite(item.expectedExitCode)) {
      testCase.expectedExitCode = item.expectedExitCode;
    }
    cases.push(testCase);
  }

  return cases.length > 0 ? { cases } : null;
}

/**
 * @param {string} projectDir
 * @returns {Promise<Array<{ id: string; name: string; stdin: string; expectedStdout?: string; expectedExitCode?: number }> | null>}
 */
export async function loadProjectTestCasesFromDisk(projectDir, fs) {
  const testsJsonPath = `${projectDir}/${PROJECT_TESTS_JSON_REL}`;
  try {
    const raw = await fs.readFile(testsJsonPath, "utf8");
    const parsed = parseTestsJson(raw);
    if (parsed?.cases?.length) return parsed.cases;
  } catch (err) {
    if (!err || typeof err !== "object" || err.code !== "ENOENT") throw err;
  }

  try {
    const sampleRaw = await fs.readFile(`${projectDir}/${PROJECT_SAMPLE_INPUT_REL}`, "utf8");
    const stdin = normalizeSampleInput(sampleRaw);
    return [{ id: "sample", name: "Sample", stdin }];
  } catch (err) {
    if (!err || typeof err !== "object" || err.code !== "ENOENT") throw err;
  }

  return null;
}

export function normalizeSampleInput(content) {
  return content
    .split("\n")
    .filter((line) => !line.trim().startsWith("#"))
    .join("\n")
    .trimEnd();
}

/**
 * @param {{ expectedStdout?: string; expectedExitCode?: number }} testCase
 * @param {{ stdout: string; stderr: string; exitCode: number; timedOut: boolean }} runResult
 */
export function evaluateTestCase(testCase, runResult) {
  const hasStdoutExpectation = typeof testCase.expectedStdout === "string";
  const hasExitExpectation = typeof testCase.expectedExitCode === "number";

  if (!hasStdoutExpectation && !hasExitExpectation) {
    return { status: "ran", failureReason: null };
  }

  if (runResult.timedOut) {
    return { status: "failed", failureReason: "timeout" };
  }

  let failureReason = null;

  if (hasExitExpectation && runResult.exitCode !== testCase.expectedExitCode) {
    failureReason = "exit_code";
  }

  if (
    hasStdoutExpectation &&
    normalizeTestOutput(runResult.stdout) !== normalizeTestOutput(testCase.expectedStdout)
  ) {
    failureReason = failureReason ?? "stdout_mismatch";
  }

  return {
    status: failureReason ? "failed" : "passed",
    failureReason,
  };
}
