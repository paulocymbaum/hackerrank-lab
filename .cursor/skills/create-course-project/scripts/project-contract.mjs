/**
 * Single source of truth for PBL project structure in Hackerrank Study.
 * Used by collect-project-context.mjs and validate-project.mjs.
 */

export const PROJECT_DELIVERY_FILENAME = "project-delivery.json";

export const LESSON_CONCEPTS_SECTION = "Lesson concepts practiced";

/** English section headers used in all project README.md files. */
export const PBL_README_SECTIONS = [
  "Problem context",
  "Goal",
  LESSON_CONCEPTS_SECTION,
  "Functional requirements",
  "Non-functional requirements",
  "Constraints",
  "Acceptance criteria",
  "Example data",
  "Suggested plan",
  "Deliverables",
  "Extensions",
];

/** Required sections for validation (Extensions optional in content). */
export const REQUIRED_PBL_SECTIONS = [
  "Problem context",
  "Goal",
  LESSON_CONCEPTS_SECTION,
  "Functional requirements",
  "Non-functional requirements",
  "Constraints",
  "Acceptance criteria",
  "Suggested plan",
  "Deliverables",
];

export const PROJECT_TREE = {
  module: "course/<NN-module-slug>/",
  projectsOverview: "projects/README.md",
  topicGroup: "projects/<NN-topic-slug>/",
  project: "projects/<NN-topic-slug>/<NNN-project-slug>/",
  readme: "README.md",
  starter: "starter/index.js",
  tests: "starter/tests.json",
  sampleInput: "starter/sample.input",
  solution: "solution/",
  delivery: PROJECT_DELIVERY_FILENAME,
};

/**
 * @param {string} markdown
 * @param {string} title
 */
export function hasSection(markdown, title) {
  const pattern = new RegExp(`^##\\s+${escapeRegExp(title)}`, "im");
  if (pattern.test(markdown)) return true;
  if (title === "Example data") {
    return /^##\s+Example data(\s+\(if applicable\))?/im.test(markdown);
  }
  if (title === "Suggested plan") {
    return /^##\s+Suggested plan(\s+\(no solution\))?/im.test(markdown);
  }
  if (title === "Extensions") {
    return /^##\s+Extensions(\s+\(optional\))?/im.test(markdown);
  }
  if (title === LESSON_CONCEPTS_SECTION) {
    return /^##\s+Lesson concepts practiced/im.test(markdown);
  }
  return false;
}

/**
 * @param {string} markdown
 */
export function isLessonSkeleton(markdown) {
  const contentLines = markdown
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("<!--"));
  const bodyLines = contentLines.filter(
    (line) => !/^#{1,2}\s+/.test(line) && !line.trim().startsWith(">"),
  );
  if (bodyLines.length < 2) return true;
  const sectionCount = contentLines.filter((line) => /^##\s+/.test(line)).length;
  const hasCode = markdown.includes("```");
  if (sectionCount >= 3 && bodyLines.length < 3 && !hasCode) return true;
  return false;
}

/**
 * @param {string} markdown
 */
export function countLessonConceptItems(markdown) {
  const section = extractSectionBody(markdown, LESSON_CONCEPTS_SECTION);
  if (!section) return 0;
  return (section.match(/^-\s+\[\s*\]\s+/gm) || []).length;
}

/**
 * @param {string} lessonMarkdown
 */
export function extractObserveLines(lessonMarkdown) {
  const block = extractSectionBody(lessonMarkdown, "What to observe");
  if (!block) return [];
  return block
    .split("\n")
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter((line) => line.length > 10);
}

/**
 * @param {string} lessonMarkdown
 * @param {string} projectMarkdown
 */
export function validateLessonProjectAlignment(lessonMarkdown, projectMarkdown) {
  const errors = [];
  const warnings = [];

  if (!lessonMarkdown.trim()) {
    errors.push("Lesson README.md is missing or empty");
    return { errors, warnings };
  }

  if (isLessonSkeleton(lessonMarkdown)) {
    errors.push("Lesson README is skeleton/empty but project exists");
  }

  if (!hasSection(projectMarkdown, LESSON_CONCEPTS_SECTION)) {
    errors.push(`Missing section: ## ${LESSON_CONCEPTS_SECTION}`);
  } else if (countLessonConceptItems(projectMarkdown) < 2) {
    errors.push(`${LESSON_CONCEPTS_SECTION} must list at least 2 checkbox items`);
  }

  const lessonTitle = (lessonMarkdown.match(/^#\s+(.+)/m) || [])[1] || "";
  const constraints = extractSectionBody(projectMarkdown, "Constraints");
  if (/truthy/i.test(lessonTitle) && /no truthiness|forbid.*truthiness|avoid truthiness/i.test(constraints)) {
    errors.push("Project constraints forbid truthiness on a truthy/falsy lesson");
  }
  if (/coercion/i.test(lessonTitle) && /no loose equality|forbid.*==|avoid coercion/i.test(constraints)) {
    errors.push("Project constraints forbid coercion on a type coercion lesson");
  }

  const observe = extractObserveLines(lessonMarkdown);
  const acceptance = extractSectionBody(projectMarkdown, "Acceptance criteria");
  if (observe.length > 0 && acceptance.trim()) {
    const overlap = observe.some((line) => {
      const words = line.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
      const acceptLower = acceptance.toLowerCase();
      return words.some((w) => acceptLower.includes(w));
    });
    if (!overlap) {
      warnings.push("No obvious overlap between lesson What to observe and acceptance criteria");
    }
  }

  return { errors, warnings };
}

/**
 * @param {string} markdown
 */
export function validateProjectReadme(markdown) {
  const errors = [];
  const warnings = [];

  if (!markdown.trim()) {
    errors.push("README.md is empty");
    return { errors, warnings };
  }

  if (!/^#\s+.+/m.test(markdown)) {
    errors.push("Missing top-level # title");
  }

  for (const section of REQUIRED_PBL_SECTIONS) {
    if (!hasSection(markdown, section)) {
      errors.push(`Missing section: ## ${section}`);
    }
  }

  if (!hasSection(markdown, "Example data")) {
    warnings.push('Missing optional section: ## Example data (if applicable)');
  }

  if (!/\bstarter\//i.test(markdown)) {
    warnings.push("Deliverables should mention starter/");
  }

  if (!/\btests\.json\b/i.test(markdown) && !/test cases/i.test(markdown)) {
    warnings.push("Deliverables should mention starter/tests.json validation cases");
  }

  return { errors, warnings };
}

/**
 * @param {string} raw
 */
export function validateProjectTestsJson(raw) {
  const errors = [];
  const warnings = [];

  if (!raw.trim()) {
    errors.push("starter/tests.json is empty");
    return { errors, warnings };
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    errors.push("starter/tests.json is not valid JSON");
    return { errors, warnings };
  }

  const cases = Array.isArray(parsed) ? parsed : parsed?.cases;
  if (!Array.isArray(cases) || cases.length === 0) {
    errors.push("starter/tests.json must define a non-empty cases array");
    return { errors, warnings };
  }

  let scoredCount = 0;
  for (let index = 0; index < cases.length; index += 1) {
    const item = cases[index];
    if (!item || typeof item !== "object") {
      errors.push(`starter/tests.json cases[${index}] must be an object`);
      continue;
    }
    if (typeof item.stdin !== "string") {
      errors.push(`starter/tests.json cases[${index}] missing string stdin`);
    }
    if (typeof item.expectedStdout === "string" || typeof item.expectedExitCode === "number") {
      scoredCount += 1;
    }
  }

  if (scoredCount === 0) {
    warnings.push(
      "starter/tests.json has no scored cases (add expectedStdout or expectedExitCode for Pass/Fail)",
    );
  }

  return { errors, warnings };
}

/**
 * @param {string} markdown
 */
export function validateModuleProjectsReadme(markdown) {
  const errors = [];
  const warnings = [];

  if (!markdown.trim()) {
    errors.push("projects/README.md is empty");
    return { errors, warnings };
  }

  if (!/^#\s+Projects\s+—/m.test(markdown)) {
    warnings.push('Title should start with "# Projects — <Module Title>"');
  }

  const requiredBlocks = [
    { label: "How to use", pattern: /^##\s+How to use/im },
    { label: "How to run or Recommended workflow", pattern: /^##\s+(How to run|Recommended workflow)/im },
    { label: "PBL contract", pattern: /^##\s+Project structure \(PBL contract\)/im },
  ];

  for (const block of requiredBlocks) {
    if (!block.pattern.test(markdown)) {
      errors.push(`Missing section: ## ${block.label}`);
    }
  }

  if (!/node starter\/index\.js/i.test(markdown)) {
    warnings.push("Should document: node starter/index.js");
  }

  if (!/NN-/.test(markdown) || !/NNN-/.test(markdown)) {
    warnings.push("Should document NN- topic and NNN- project folder conventions");
  }

  return { errors, warnings };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @param {string} markdown
 * @param {string} heading
 */
function extractSectionBody(markdown, heading) {
  const pattern = new RegExp(
    `(^|\\r?\\n)##\\s+${escapeRegExp(heading)}\\s*\\r?\\n([\\s\\S]*)`,
    "i",
  );
  const match = markdown.match(pattern);
  if (!match) return "";
  const body = match[2];
  const nextHeading = body.search(/\r?\n##\s/);
  return nextHeading >= 0 ? body.slice(0, nextHeading) : body;
}
