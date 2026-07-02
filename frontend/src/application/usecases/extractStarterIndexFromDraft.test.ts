import { describe, expect, it } from "vitest";
import {
  canRunProjectDraft,
  extractStarterIndexFromDraft,
} from "./extractStarterIndexFromDraft";

describe("extractStarterIndexFromDraft", () => {
  it("extracts starter/index.js from import-starter markdown", () => {
    const draft = `Notes\n\n### \`starter/index.js\`\n\n\`\`\`javascript\nconst x = 1;\nconsole.log(x);\n\`\`\``;
    expect(extractStarterIndexFromDraft(draft)).toBe("const x = 1;\nconsole.log(x);");
  });

  it("extracts starter/index.js from plain import separator blocks", () => {
    const draft = `// --- starter/index.js ---\n\nconst x = 1;\nconsole.log(x);\n\n// --- starter/utils.js ---\n\nexport const y = 2;`;
    expect(extractStarterIndexFromDraft(draft)).toBe("const x = 1;\nconsole.log(x);");
  });

  it("prefers the last code fence when multiple blocks exist", () => {
    const draft = "```javascript\nold();\n```\n\nNotes\n\n```javascript\nnewCode();\n```";
    expect(extractStarterIndexFromDraft(draft)).toBe("newCode();");
  });

  it("returns raw source when draft is plain code", () => {
    const draft = "const readline = require('node:readline');\nfunction main() {}";
    expect(extractStarterIndexFromDraft(draft)).toBe(draft);
  });

  it("returns null for prose-only drafts", () => {
    expect(extractStarterIndexFromDraft("I implemented validation and tests.")).toBeNull();
  });
});

describe("canRunProjectDraft", () => {
  it("allows run when starter exists on disk even without draft code", () => {
    expect(canRunProjectDraft("", true)).toBe(true);
  });

  it("allows run when draft contains starter code", () => {
    expect(canRunProjectDraft("const x = 1;", false)).toBe(true);
  });

  it("blocks run when neither draft code nor disk starter exist", () => {
    expect(canRunProjectDraft("", false)).toBe(false);
  });
});
