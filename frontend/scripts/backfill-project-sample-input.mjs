#!/usr/bin/env node
/**
 * Ensures every runnable project has starter/sample.input.
 * Tries to derive stdin from README Example data / Acceptance criteria.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const courseDir = path.join(repoRoot, "course");
const templatePath = path.join(
  repoRoot,
  ".cursor/skills/create-course-project/templates/starter-sample.input",
);

const DEFAULT_TEMPLATE = `# Sample stdin for: node starter/index.js < starter/sample.input
# Customize from README Example data.

`;

function normalizeSampleInput(content) {
  return content
    .split("\n")
    .filter((line) => !line.trim().startsWith("#"))
    .join("\n")
    .trimEnd();
}

function isUsableSample(content) {
  return normalizeSampleInput(content).length > 0;
}

async function readTemplate() {
  try {
    return await fs.readFile(templatePath, "utf8");
  } catch {
    return DEFAULT_TEMPLATE;
  }
}

function extractInputBulletValues(block) {
  return [...block.matchAll(/[-*]\s*`([^`]+)`/g)].map((match) => match[1]);
}

function deriveSampleInput(readmeMarkdown) {
  if (!readmeMarkdown.trim()) return null;

  const inputBlocks = [
    ...readmeMarkdown.matchAll(/Input:\s*\n((?:\s*[-*]\s*`[^`]+`\s*\n?)+)/gi),
  ];

  for (const match of inputBlocks) {
    const values = extractInputBulletValues(match[1]);
    if (values.length > 1) return `${values.join("\n")}\n`;
  }

  for (const match of inputBlocks) {
    const values = extractInputBulletValues(match[1]);
    if (values.length === 1) return `${values[0]}\n`;
  }

  const patterns = [
    /Acceptance criteria[\s\S]*?Input\s+`([^`]+)`/i,
    /[-*]\s*\[\s*\]\s*Input\s+`([^`]+)`/i,
    /[-*]\s*Input\s+`([^`]+)`/i,
    /[-*]\s*`([^`]+)`\s*→/,
  ];

  for (const pattern of patterns) {
    const match = readmeMarkdown.match(pattern);
    if (match?.[1] !== undefined) return `${match[1]}\n`;
  }

  if (/empty line|Input:\s*\n\s*-\s*``/i.test(readmeMarkdown)) {
    return "\n";
  }

  return null;
}

async function findStarterProjects(dir, found = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await findStarterProjects(abs, found);
      continue;
    }
    if (entry.name === "index.js" && abs.includes(`${path.sep}starter${path.sep}`)) {
      found.push(path.dirname(path.dirname(abs)));
    }
  }
  return found;
}

function shouldWriteSample(existing, derived, template) {
  if (!existing) return true;
  if (!isUsableSample(existing)) return true;
  if (!derived) return false;
  return normalizeSampleInput(existing) !== normalizeSampleInput(derived);
}

async function main() {
  const template = await readTemplate();
  const projects = await findStarterProjects(courseDir);
  let created = 0;
  let repaired = 0;
  let skipped = 0;

  for (const projectDir of projects.sort()) {
    const samplePath = path.join(projectDir, "starter", "sample.input");
    const readme = await fs.readFile(path.join(projectDir, "README.md"), "utf8").catch(() => "");
    const derived = deriveSampleInput(readme);

    let existing = null;
    try {
      existing = await fs.readFile(samplePath, "utf8");
    } catch {
      // missing
    }

    if (!shouldWriteSample(existing, derived, template)) {
      skipped += 1;
      continue;
    }

    const content = derived ?? (isUsableSample(template) ? template : "\n");
    await fs.mkdir(path.dirname(samplePath), { recursive: true });
    await fs.writeFile(samplePath, content, "utf8");

    if (existing) {
      repaired += 1;
      process.stdout.write(`Repaired ${path.relative(repoRoot, samplePath)}\n`);
    } else {
      created += 1;
      process.stdout.write(`Created ${path.relative(repoRoot, samplePath)}\n`);
    }
  }

  process.stdout.write(
    `\nDone: ${created} created, ${repaired} repaired, ${skipped} already usable.\n`,
  );
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
