/**
 * Single source of truth for PBL project structure in Hackerrank Study.
 * Used by collect-project-context.mjs and validate-project.mjs.
 */

export const PROJECT_DELIVERY_FILENAME = "project-delivery.json";

/** English section headers used in all project README.md files. */
export const PBL_README_SECTIONS = [
  "Problem context",
  "Goal",
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
  return false;
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
