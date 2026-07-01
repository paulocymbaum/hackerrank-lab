import type { ContentGraphCatalogRef } from "../../domain/types/contentGraph";

export type ContentMapSkillPromptContext = {
  courseSlug: string;
  graphIndex: string;
  label: string;
  catalogRef?: ContentGraphCatalogRef;
};

function requireCatalogRef(ctx: ContentMapSkillPromptContext): ContentGraphCatalogRef {
  if (!ctx.catalogRef) {
    throw new Error("catalogRef is required for existing lesson prompts");
  }
  return ctx.catalogRef;
}

export function buildLessonSocraticPrompt(ctx: ContentMapSkillPromptContext): string {
  const { courseId, moduleId, lessonId } = requireCatalogRef(ctx);

  return [
    "Use the teacher-socratic skill to help me learn this topic (hints first — no full solution unless I ask).",
    "",
    `Topic: ${ctx.label} (${ctx.graphIndex})`,
    `Course: ${courseId}`,
    `Module: ${moduleId}`,
    `Lesson: ${lessonId}`,
    "",
    "Guide me with Socratic questions tied to this lesson topic.",
  ].join("\n");
}

export function buildLessonQuizPrompt(ctx: ContentMapSkillPromptContext): string {
  const { courseId, moduleId, lessonId } = requireCatalogRef(ctx);

  return [
    "Use the create-course-quiz skill to create a quiz for this lesson.",
    "",
    `Topic: ${ctx.label} (${ctx.graphIndex})`,
    `Course: ${courseId}`,
    `Module: ${moduleId}`,
    `Lesson: ${lessonId}`,
    "",
    "Run collect-lesson-context first:",
    `node .cursor/skills/create-course-quiz/scripts/collect-lesson-context.mjs ${lessonId} --course ${ctx.courseSlug} --module ${moduleId}`,
    "",
    "Then write quiz.json under the lesson quiz/ folder, validate, and run catalog:generate.",
  ].join("\n");
}

export function buildLessonProjectPrompt(ctx: ContentMapSkillPromptContext): string {
  const { courseId, moduleId, lessonId } = requireCatalogRef(ctx);

  return [
    "Use the create-course-project skill to create a new PBL project for this lesson.",
    "",
    `Topic: ${ctx.label} (${ctx.graphIndex})`,
    `Course: ${courseId}`,
    `Module: ${moduleId}`,
    `Lesson: ${lessonId}`,
    "",
    "Run collect-project-context first:",
    `node .cursor/skills/create-course-project/scripts/collect-project-context.mjs --course ${ctx.courseSlug} --module ${moduleId} --lesson ${lessonId}`,
    "",
    "Then scaffold the project folder, fill the PBL README, validate, and run catalog:generate.",
  ].join("\n");
}

export function buildGenerateLessonPrompt(ctx: ContentMapSkillPromptContext): string {
  return [
    "Use the generate-lesson-teacher skill to scaffold and generate this planned lesson.",
    "",
    `Topic: ${ctx.label} (${ctx.graphIndex})`,
    `Course: ${ctx.courseSlug}`,
    "",
    "Steps:",
    `1. Find the topic in the graph: node .cursor/tools/graph/find-node-by-index.js "${ctx.graphIndex}"`,
    `2. Scaffold the lesson folder: node scripts/graph/scaffold-from-graph.mjs "${ctx.graphIndex}"`,
    "3. Write the explanation markdown and validate the lesson.",
    "4. Run catalog:generate.",
    "",
    "Follow .cursor/rules/course-hierarchy.mdc.",
  ].join("\n");
}
