import { describe, expect, it } from "vitest";
import type { ReaderEntry } from "../../domain/types/reader";
import {
  appendStarterToDraft,
  buildStarterDeliveryContent,
  getStarterFiles,
  hasProjectStarter,
} from "./importProjectStarter";

const entries: ReaderEntry[] = [
  { path: "starter", kind: "dir" },
  { path: "starter/index.js", kind: "file", content: 'console.log("hi");\n' },
  { path: "README.md", kind: "file", content: "# Brief" },
  { path: "starter/utils.js", kind: "file", content: "export const x = 1;\n" },
];

describe("importProjectStarter", () => {
  it("collects starter code files but not sample.input", () => {
    const withSample: ReaderEntry[] = [
      ...entries,
      { path: "starter/sample.input", kind: "file", content: "Alice\n" },
    ];
    expect(getStarterFiles(withSample).map((f) => f.path)).toEqual([
      "starter/index.js",
      "starter/utils.js",
    ]);
  });

  it("detects starter presence", () => {
    expect(hasProjectStarter(entries)).toBe(true);
    expect(hasProjectStarter([{ path: "README.md", kind: "file", content: "x" }])).toBe(false);
  });

  it("builds fenced markdown blocks per starter file", () => {
    const content = buildStarterDeliveryContent(entries);
    expect(content).toContain("### `starter/index.js`");
    expect(content).toContain('console.log("hi");');
    expect(content).toContain("### `starter/utils.js`");
  });

  it("appends starter to existing draft with separator", () => {
    const result = appendStarterToDraft("My notes", entries);
    expect(result.startsWith("My notes")).toBe(true);
    expect(result).toContain("---");
    expect(result).toContain("starter/index.js");
  });

  it("returns starter-only content when draft is empty", () => {
    const result = appendStarterToDraft("  ", entries);
    expect(result).toContain("starter/index.js");
    expect(result).not.toContain("---");
  });
});
