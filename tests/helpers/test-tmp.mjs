import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

export function makeTmpDir(prefix = "hr-study-test-") {
  return mkdtempSync(path.join(tmpdir(), prefix));
}

export function cleanupTmpDir(dir) {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}
