const fs = require("fs");
const path = require("path");

const SKILL_TEMPLATES_DIR = path.resolve(
  __dirname,
  "../../skills/create-course-project/templates",
);

function loadTemplate(name) {
  return fs.readFileSync(path.join(SKILL_TEMPLATES_DIR, name), "utf8");
}

function renderTemplate(template, vars) {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, String(value)),
    template,
  );
}

function moduleProjectsReadme(moduleTitle) {
  return renderTemplate(loadTemplate("module-projects-readme.md"), {
    MODULE_TITLE: moduleTitle,
  });
}

function projectReadmeSkeleton(projectTitle) {
  return renderTemplate(loadTemplate("project-readme-skeleton.md"), {
    PROJECT_TITLE: projectTitle,
  });
}

function starterIndexStub(projectTitle) {
  return renderTemplate(loadTemplate("starter-index.js"), {
    PROJECT_TITLE: projectTitle,
  });
}

module.exports = {
  moduleProjectsReadme,
  projectReadmeSkeleton,
  starterIndexStub,
};
