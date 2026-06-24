import { describe, expect, it } from "vitest";
import { formatDeliveryMarkdownForDisplay } from "./formatDeliveryMarkdown";

describe("formatDeliveryMarkdownForDisplay", () => {
  it("keeps fenced markdown unchanged", () => {
    const input = "### `starter/index.js`\n\n```javascript\nconst x = 1;\n```";
    expect(formatDeliveryMarkdownForDisplay(input)).toBe(input);
  });

  it("wraps raw source code in a javascript fence", () => {
    const input = `const readline = require("node:readline");\n\nfunction main() {\n  console.log("hi");\n}`;
    expect(formatDeliveryMarkdownForDisplay(input)).toBe(
      `\`\`\`javascript\n${input}\n\`\`\``,
    );
  });

  it("leaves plain prose unchanged", () => {
    const input = "I implemented validation and added tests for edge cases.";
    expect(formatDeliveryMarkdownForDisplay(input)).toBe(input);
  });
});
