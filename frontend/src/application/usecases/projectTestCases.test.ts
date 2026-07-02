import { describe, expect, it } from "vitest";
import type { ReaderEntry } from "../../domain/types/reader";
import {
  evaluateTestCase,
  getProjectTestCases,
  parseTestsJson,
} from "./projectTestCases";

describe("projectTestCases", () => {
  it("parses tests.json cases", () => {
    const parsed = parseTestsJson(
      JSON.stringify({
        cases: [
          { id: "a", name: "Case A", stdin: "1\n", expectedStdout: "1\n" },
        ],
      }),
    );
    expect(parsed?.cases).toHaveLength(1);
    expect(parsed?.cases[0]?.id).toBe("a");
  });

  it("falls back to sample.input as a single case", () => {
    const entries: ReaderEntry[] = [
      { path: "starter/sample.input", kind: "file", content: "hello\n" },
    ];
    expect(getProjectTestCases(entries)).toEqual([
      { id: "sample", name: "Sample", stdin: "hello" },
    ]);
  });

  it("prefers tests.json over sample.input", () => {
    const entries: ReaderEntry[] = [
      { path: "starter/tests.json", kind: "file", content: '{"cases":[{"id":"x","name":"X","stdin":""}]}' },
      { path: "starter/sample.input", kind: "file", content: "ignored\n" },
    ];
    expect(getProjectTestCases(entries)?.[0]?.id).toBe("x");
  });

  it("evaluates stdout and exit code expectations", () => {
    const pass = evaluateTestCase(
      { id: "1", name: "1", stdin: "", expectedStdout: "ok\n", expectedExitCode: 0 },
      { stdout: "ok\n", exitCode: 0, timedOut: false },
    );
    expect(pass.status).toBe("passed");

    const fail = evaluateTestCase(
      { id: "2", name: "2", stdin: "", expectedStdout: "ok\n" },
      { stdout: "no\n", exitCode: 0, timedOut: false },
    );
    expect(fail.status).toBe("failed");
    expect(fail.failureReason).toBe("stdout_mismatch");
  });
});
