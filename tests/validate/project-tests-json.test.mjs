import { test } from "node:test";
import assert from "node:assert/strict";
import {
  deriveProjectTestsFromReadme,
  extractAcceptanceCases,
  extractExampleCase,
  countScoredCases,
} from "../../frontend/scripts/derive-project-tests-lib.mjs";
import { parseTestsJson } from "../../frontend/scripts/project-test-cases-lib.mjs";
import { getProjectTestOverride } from "../../frontend/scripts/project-tests-overrides.mjs";

const scoreAccumulatorReadme = `# Score Accumulator

## Acceptance criteria
- [ ] \`10\`, \`+5\`, \`-3\`, \`*2\`, \`done\` → \`Total: 24\`
- [ ] \`100\`, \`done\` → \`Total: 100\`
- [ ] \`abc\` as first line → error

## Example data

Input:
- \`10\`
- \`+25\`
- \`-10\`
- \`*2\`
- \`done\`

Output:

- Total: 50
`;

test("extractAcceptanceCases parses arrow criteria", () => {
  const cases = extractAcceptanceCases(scoreAccumulatorReadme);
  assert.ok(cases.length >= 2);
  assert.equal(cases.some((item) => item.stdin.includes("done")), true);
});

test("extractExampleCase parses bullet input/output", () => {
  const example = extractExampleCase(scoreAccumulatorReadme);
  assert.ok(example);
  assert.match(example.stdin, /10/);
  assert.equal(example.expectedStdout, "Total: 50\n");
});

test("deriveProjectTestsFromReadme includes example and acceptance", () => {
  const cases = deriveProjectTestsFromReadme(scoreAccumulatorReadme);
  assert.ok(countScoredCases(cases) >= 2);
});

test("parseTestsJson accepts cases array", () => {
  const parsed = parseTestsJson(
    JSON.stringify({
      cases: [{ id: "a", name: "A", stdin: "1\n", expectedStdout: "1\n" }],
    }),
  );
  assert.equal(parsed?.cases.length, 1);
});

test("overrides include all runnable project slugs", () => {
  const slugs = [
    "004-hello-stdin",
    "014-score-accumulator",
    "001-cli-input-validator",
    "001-output-order-predictor",
    "001-to-result",
  ];
  for (const slug of slugs) {
    const override = getProjectTestOverride(slug);
    assert.ok(override?.cases?.length, `missing override for ${slug}`);
    assert.ok(countScoredCases(override.cases) > 0, `no scored cases for ${slug}`);
  }
});
