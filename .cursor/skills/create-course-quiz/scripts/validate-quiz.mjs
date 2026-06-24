#!/usr/bin/env node
/**
 * Validate a quiz JSON file against the Hackerrank Study quiz schema.
 *
 * Usage:
 *   node validate-quiz.mjs course/01-javascript-fundamentals/quiz/01-fundamentals-check.json
 *   node validate-quiz.mjs course/01-javascript-fundamentals/quiz/*.json
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");

function isValidQuizPayload(value, fileLabel) {
  const errors = [];

  if (!value || typeof value !== "object") {
    return ["Root must be a JSON object."];
  }
  if (typeof value.id !== "string" || !value.id.trim()) {
    errors.push("`id` must be a non-empty string.");
  }
  if (typeof value.title !== "string" || !value.title.trim()) {
    errors.push("`title` must be a non-empty string.");
  }
  if (value.description != null && typeof value.description !== "string") {
    errors.push("`description` must be a string when present.");
  }
  if (value.lessonId != null && typeof value.lessonId !== "string") {
    errors.push("`lessonId` must be a string when present.");
  }
  if (value.graphIndex != null && typeof value.graphIndex !== "string") {
    errors.push("`graphIndex` must be a string when present.");
  }
  if (!Array.isArray(value.questions) || value.questions.length === 0) {
    errors.push("`questions` must be a non-empty array.");
    return errors;
  }

  const questionIds = new Set();
  value.questions.forEach((q, index) => {
    const label = `questions[${index}]`;
    if (!q || typeof q !== "object") {
      errors.push(`${label}: must be an object.`);
      return;
    }
    if (typeof q.id !== "string" || !q.id.trim()) {
      errors.push(`${label}: \`id\` must be a non-empty string.`);
    } else if (questionIds.has(q.id)) {
      errors.push(`${label}: duplicate question id "${q.id}".`);
    } else {
      questionIds.add(q.id);
    }
    if (typeof q.prompt !== "string" || !q.prompt.trim()) {
      errors.push(`${label}: \`prompt\` must be a non-empty string.`);
    }
    if (typeof q.correctOptionId !== "string" || !q.correctOptionId.trim()) {
      errors.push(`${label}: \`correctOptionId\` must be a non-empty string.`);
    }
    if (q.explanation != null && typeof q.explanation !== "string") {
      errors.push(`${label}: \`explanation\` must be a string when present.`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      errors.push(`${label}: \`options\` must have at least 2 entries.`);
      return;
    }

    const optionIds = new Set();
    q.options.forEach((o, oIndex) => {
      const oLabel = `${label}.options[${oIndex}]`;
      if (!o || typeof o !== "object") {
        errors.push(`${oLabel}: must be an object.`);
        return;
      }
      if (typeof o.id !== "string" || !o.id.trim()) {
        errors.push(`${oLabel}: \`id\` must be a non-empty string.`);
      } else if (optionIds.has(o.id)) {
        errors.push(`${oLabel}: duplicate option id "${o.id}".`);
      } else {
        optionIds.add(o.id);
      }
      if (typeof o.text !== "string" || !o.text.trim()) {
        errors.push(`${oLabel}: \`text\` must be a non-empty string.`);
      }
    });

    if (q.correctOptionId && !optionIds.has(q.correctOptionId)) {
      errors.push(`${label}: \`correctOptionId\` "${q.correctOptionId}" does not match any option id.`);
    }
  });

  if (fileLabel) {
    const base = path.basename(fileLabel, ".json");
    if (typeof value.id === "string" && value.id !== base && !base.endsWith(value.id)) {
      errors.push(`Hint: file name "${base}.json" usually matches quiz id "${value.id}".`);
    }
  }

  return errors;
}

async function validateFile(absPath) {
  const rel = path.relative(repoRoot, absPath) || absPath;
  const raw = await fs.readFile(absPath, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { rel, ok: false, errors: [`Invalid JSON: ${e.message}`] };
  }
  const errors = isValidQuizPayload(parsed, rel);
  return { rel, ok: errors.length === 0, errors, questionCount: parsed.questions?.length ?? 0, id: parsed.id, title: parsed.title };
}

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("Usage: validate-quiz.mjs <quiz.json> [quiz2.json ...]");
    process.exitCode = 1;
    return;
  }

  let failed = 0;
  for (const file of files) {
    const abs = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
    const result = await validateFile(abs);
    if (result.ok) {
      console.log(`OK  ${result.rel} (${result.questionCount} questions, id=${result.id})`);
    } else {
      failed += 1;
      console.error(`FAIL ${result.rel}`);
      for (const err of result.errors) console.error(`  - ${err}`);
    }
  }

  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exitCode = 1;
});
