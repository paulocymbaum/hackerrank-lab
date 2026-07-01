import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  evaluateTestCase,
  loadProjectTestCasesFromDisk,
  normalizeSampleInput,
  PROJECT_SAMPLE_INPUT_REL,
  PROJECT_STARTER_ENTRY_REL,
} from "./project-test-cases-lib.mjs";

export const PROJECT_RUN_TIMEOUT_MS = 5000;
export const PROJECT_RUN_MAX_OUTPUT = 65_536;
export { PROJECT_SAMPLE_INPUT_REL, PROJECT_STARTER_ENTRY_REL, normalizeSampleInput };

function ensureTrailingNewline(text) {
  if (!text) return "\n";
  return text.endsWith("\n") ? text : `${text}\n`;
}

async function prepareRunnableScript({ projectDir, code }) {
  const starterPath = path.resolve(projectDir, PROJECT_STARTER_ENTRY_REL);
  const usesDraft = typeof code === "string" && code.trim();

  if (usesDraft) {
    const tempPath = path.join(os.tmpdir(), `hackerrank-study-run-${randomUUID()}.js`);
    await fs.writeFile(tempPath, code, "utf8");
    return {
      scriptPath: path.resolve(tempPath),
      tempPath,
      usesDraft: true,
    };
  }

  try {
    await fs.access(starterPath);
  } catch {
    return { error: "missing_starter" };
  }

  return {
    scriptPath: starterPath,
    tempPath: null,
    usesDraft: false,
  };
}

function buildCommandLabel(usesDraft, stdinLabel) {
  const inputRef = stdinLabel ?? PROJECT_SAMPLE_INPUT_REL;
  if (usesDraft) {
    return `node <draft> < ${inputRef}`;
  }
  return `node ${PROJECT_STARTER_ENTRY_REL} < ${inputRef}`;
}

export async function runProjectTestMatrix(input) {
  const { repoRoot, rootPath, code } = input;
  const projectDir = path.join(repoRoot, rootPath);
  const testCases = await loadProjectTestCasesFromDisk(projectDir, fs);

  if (!testCases?.length) {
    return { ok: false, error: "missing_tests" };
  }

  const prepared = await prepareRunnableScript({ projectDir, code });
  if (prepared.error) {
    return { ok: false, error: prepared.error };
  }

  const cwd = path.join(projectDir, "starter");
  const cases = [];

  try {
    for (const testCase of testCases) {
      const runResult = await spawnNodeWithStdin({
        scriptPath: prepared.scriptPath,
        cwd,
        stdin: testCase.stdin ?? "",
      });

      const evaluation = evaluateTestCase(testCase, runResult);
      cases.push({
        id: testCase.id,
        name: testCase.name,
        status: evaluation.status,
        command: buildCommandLabel(prepared.usesDraft, testCase.id),
        stdin: testCase.stdin ?? "",
        stdout: runResult.stdout,
        stderr: runResult.stderr,
        exitCode: runResult.exitCode,
        timedOut: runResult.timedOut,
        ...(typeof testCase.expectedStdout === "string"
          ? { expectedStdout: testCase.expectedStdout }
          : {}),
        ...(typeof testCase.expectedExitCode === "number"
          ? { expectedExitCode: testCase.expectedExitCode }
          : {}),
        ...(evaluation.failureReason ? { failureReason: evaluation.failureReason } : {}),
      });
    }
  } finally {
    if (prepared.tempPath) {
      await fs.unlink(prepared.tempPath).catch(() => {});
    }
  }

  const passedCount = cases.filter((item) => item.status === "passed").length;
  const failedCount = cases.filter((item) => item.status === "failed").length;

  return {
    ok: true,
    matrix: {
      passedCount,
      failedCount,
      totalCount: cases.length,
      cases,
    },
  };
}

/** @deprecated Use runProjectTestMatrix — kept for compatibility. */
export async function runProjectStarter(input) {
  const matrixResult = await runProjectTestMatrix(input);
  if (!matrixResult.ok) return matrixResult;

  const first = matrixResult.matrix.cases[0];
  if (!first) {
    return { ok: false, error: "missing_tests" };
  }

  return {
    ok: true,
    command: first.command,
    stdout: first.stdout,
    stderr: first.stderr,
    exitCode: first.exitCode,
    timedOut: first.timedOut,
  };
}

function spawnNodeWithStdin(input) {
  const { scriptPath, cwd, stdin } = input;
  const payload = ensureTrailingNewline(stdin);

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let stdinSent = false;

    const child = spawn("node", [scriptPath], {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, PROJECT_RUN_TIMEOUT_MS);

    const sendStdin = () => {
      if (stdinSent) return;
      stdinSent = true;
      child.stdin.write(payload);
      child.stdin.end();
    };

    child.stdout.on("data", (chunk) => {
      stdout = appendCapped(stdout, chunk.toString("utf8"));
    });

    child.stderr.on("data", (chunk) => {
      stderr = appendCapped(stderr, chunk.toString("utf8"));
    });

    child.on("spawn", sendStdin);

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr: stderr || String(err.message ?? err),
        exitCode: 1,
        timedOut: false,
      });
    });

    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr,
        exitCode: typeof exitCode === "number" ? exitCode : 1,
        timedOut,
      });
    });
  });
}

function appendCapped(current, chunk) {
  const next = current + chunk;
  if (next.length <= PROJECT_RUN_MAX_OUTPUT) return next;
  return next.slice(0, PROJECT_RUN_MAX_OUTPUT) + "\n… (output truncated)";
}
