/**
 * Derive starter/tests.json cases from project README.md content.
 */

function slugify(value, fallback = "case") {
  const slug = String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || fallback;
}

function extractBacktickValues(text) {
  return [...text.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
}

function normalizeExpectedOutput(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";
  if (/^error$/i.test(trimmed)) return "ERROR:";
  if (trimmed.startsWith("ERROR:")) return trimmed.endsWith("\n") ? trimmed : `${trimmed}\n`;
  return trimmed.endsWith("\n") ? trimmed : `${trimmed}\n`;
}

function parseArrowCriterion(line) {
  const arrowMatch = line.match(/^[-*]\s*\[\s*\]\s*(.+?)\s*→\s*(.+)$/i);
  const plainArrow = line.match(/^[-*]\s*(.+?)\s*→\s*(.+)$/i);
  const match = arrowMatch ?? plainArrow;
  if (!match) return null;

  const left = match[1].trim();
  const right = match[2].trim();

  if (/^input\s+/i.test(left)) {
    const inputMatch = left.match(/^input\s+`([^`]+)`/i);
    const stdin = inputMatch?.[1] ?? "";
    let expectedStdout = right;
    const printsMatch = right.match(/^prints\s+`([^`]+)`/i);
    if (printsMatch) expectedStdout = printsMatch[1];
    return {
      id: slugify(left),
      name: left.replace(/^Input\s+/i, "Input: "),
      stdin: stdin.includes("\n") ? stdin : `${stdin}\n`,
      expectedStdout: normalizeExpectedOutput(expectedStdout),
      expectedExitCode: 0,
    };
  }

  const values = extractBacktickValues(left);
  if (values.length === 0) return null;

  const stdin = values.join("\n");
  let expectedStdout = right;
  if (/^error/i.test(right) && !right.startsWith("ERROR:")) {
    if (/invalid score/i.test(right)) expectedStdout = "ERROR: invalid score";
    else if (/invalid operation/i.test(right)) expectedStdout = "ERROR: invalid operation";
    else if (/invalid range/i.test(right)) expectedStdout = "ERROR: invalid range";
    else if (/invalid json/i.test(right)) expectedStdout = "ERROR: invalid JSON";
    else if (/unknown/i.test(right)) expectedStdout = "ERROR: unknown";
    else if (/name is required/i.test(right)) expectedStdout = "ERROR: name is required";
    else expectedStdout = "ERROR:";
  } else {
    const rightValues = extractBacktickValues(right);
    if (rightValues.length === 1 && !right.includes(" and ")) {
      expectedStdout = normalizeExpectedOutput(rightValues[0]);
    } else if (rightValues.length > 1) {
      expectedStdout = normalizeExpectedOutput(rightValues.join("\n"));
    } else {
      expectedStdout = normalizeExpectedOutput(right);
    }
  }

  return {
    id: slugify(values.join("-")),
    name: left.slice(0, 80),
    stdin: stdin.endsWith("\n") || stdin === "" ? stdin : `${stdin}\n`,
    expectedStdout,
    expectedExitCode: 0,
  };
}

export function extractAcceptanceCases(markdown) {
  const section = markdown.match(/^##\s+Acceptance criteria\s*[\r\n]+([\s\S]*?)(?=^##\s|\Z)/im);
  if (!section) return [];

  const cases = [];
  const seen = new Set();

  for (const line of section[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("-")) continue;
    const parsed = parseArrowCriterion(trimmed);
    if (!parsed) continue;
    if (seen.has(parsed.id)) continue;
    seen.add(parsed.id);
    cases.push(parsed);
  }

  return cases;
}

function extractBulletBlock(block) {
  return [...block.matchAll(/^\s*[-*]\s*`([^`]+)`\s*$/gm)].map((match) => match[1]);
}

export function extractExampleCase(markdown) {
  const exampleSection = markdown.match(/^##\s+Example data[\s\S]*$/im);
  if (!exampleSection) return null;

  const text = exampleSection[0];
  const inputBlock = text.match(/Input:\s*\n([\s\S]*?)(?=\nOutput:|\n##\s|$)/i);
  const outputBlock = text.match(/Output:\s*\n([\s\S]*?)(?=\n##\s|$)/im);

  let stdin = "";
  if (inputBlock) {
    const bullets = extractBulletBlock(inputBlock[1]);
    if (bullets.length > 0) {
      stdin = `${bullets.join("\n")}\n`;
    }
  }

  let expectedStdout = "";
  if (outputBlock) {
    const bullets = extractBulletBlock(outputBlock[1]);
    if (bullets.length > 0) {
      expectedStdout = normalizeExpectedOutput(bullets.join("\n"));
    } else {
      const code = outputBlock[1].match(/```[\w-]*\n([\s\S]*?)```/);
      if (code?.[1]) {
        expectedStdout = normalizeExpectedOutput(code[1].trim());
      } else {
        const plainLine = outputBlock[1].match(/^-\s+(.+)$/m);
        if (plainLine?.[1]) {
          expectedStdout = normalizeExpectedOutput(plainLine[1].trim());
        } else {
          const lines = outputBlock[1]
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith("#"));
          if (lines.length > 0) expectedStdout = normalizeExpectedOutput(lines.join("\n"));
        }
      }
    }
  }

  if (!stdin && !expectedStdout) return null;

  return {
    id: "example",
    name: "Example from README",
    stdin,
    ...(expectedStdout ? { expectedStdout, expectedExitCode: 0 } : {}),
  };
}

export function deriveProjectTestsFromReadme(markdown) {
  const cases = [];
  const seen = new Set();

  for (const testCase of extractAcceptanceCases(markdown)) {
    if (seen.has(testCase.id)) continue;
    seen.add(testCase.id);
    cases.push(testCase);
  }

  const example = extractExampleCase(markdown);
  if (example && !seen.has(example.id)) {
    cases.unshift(example);
  }

  return cases;
}

export function countScoredCases(cases) {
  return cases.filter(
    (item) => typeof item.expectedStdout === "string" || typeof item.expectedExitCode === "number",
  ).length;
}
