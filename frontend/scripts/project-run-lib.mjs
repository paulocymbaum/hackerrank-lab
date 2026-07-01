import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const PROJECT_SAMPLE_INPUT_REL = "starter/sample.input";
export const PROJECT_STARTER_ENTRY_REL = "starter/index.js";
export const PROJECT_RUN_TIMEOUT_MS = 5000;
export const PROJECT_RUN_MAX_OUTPUT = 65_536;

export function normalizeSampleInput(content) {
  return content
    .split("\n")
    .filter((line) => !line.trim().startsWith("#"))
    .join("\n")
    .trimEnd();
}

function ensureTrailingNewline(text) {
  if (!text) return "\n";
  return text.endsWith("\n") ? text : `${text}\n`;
}

async function resolveSampleInput({ sampleInputOverride, sampleInputPath }) {
  if (typeof sampleInputOverride === "string") {
    const normalized = normalizeSampleInput(sampleInputOverride);
    if (normalized.length > 0) return normalized;
  }

  try {
    const fromDisk = normalizeSampleInput(await fs.readFile(sampleInputPath, "utf8"));
    if (fromDisk.length > 0) return fromDisk;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      return null;
    }
    throw err;
  }

  return null;
}

export async function runProjectStarter(input) {
  const { repoRoot, rootPath, code, sampleInput: sampleInputOverride } = input;
  const projectDir = path.join(repoRoot, rootPath);
  const sampleInputPath = path.join(projectDir, PROJECT_SAMPLE_INPUT_REL);
  const starterPath = path.resolve(projectDir, PROJECT_STARTER_ENTRY_REL);

  const sampleInput = await resolveSampleInput({ sampleInputOverride, sampleInputPath });
  if (sampleInput === null) {
    return { ok: false, error: "missing_sample_input" };
  }

  let scriptPath = starterPath;
  let tempPath = null;
  const usesDraft = typeof code === "string" && code.trim();

  if (usesDraft) {
    tempPath = path.join(os.tmpdir(), `hackerrank-study-run-${randomUUID()}.js`);
    await fs.writeFile(tempPath, code, "utf8");
    scriptPath = path.resolve(tempPath);
  } else {
    try {
      await fs.access(starterPath);
    } catch {
      return { ok: false, error: "missing_starter" };
    }
  }

  try {
    const result = await spawnNodeWithStdin({
      scriptPath,
      cwd: path.join(projectDir, "starter"),
      stdin: sampleInput,
    });
    return { ok: true, ...result, command: buildCommandLabel(usesDraft ? code : null) };
  } finally {
    if (tempPath) {
      await fs.unlink(tempPath).catch(() => {});
    }
  }
}

function buildCommandLabel(code) {
  if (typeof code === "string" && code.trim()) {
    return `node <draft> < ${PROJECT_SAMPLE_INPUT_REL}`;
  }
  return `node ${PROJECT_STARTER_ENTRY_REL} < ${PROJECT_SAMPLE_INPUT_REL}`;
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
