export type DeliveryPromptContext = {
  courseId: string;
  courseTitle: string;
  projectTitle: string;
  projectId: string;
  rootPath: string;
  topicTitle: string;
};

export function buildReviewCursorPrompt(ctx: DeliveryPromptContext): string {
  const moduleLabel = ctx.courseTitle || ctx.courseId;

  return [
    "Use the review-course-project skill to grade my project delivery.",
    "",
    `Module: ${moduleLabel} (${ctx.courseId})`,
    `Project: ${ctx.projectTitle} (${ctx.projectId})`,
    ...(ctx.topicTitle ? [`Topic: ${ctx.topicTitle}`] : []),
    `Project path: ${ctx.rootPath}`,
    "",
    "Review my latest delivery using my last 3 submissions (chronological order), this project's README acceptance criteria, and starter/ code.",
    "Grade only the exercise: module lesson concepts, project acceptance criteria, and starter/ code. Do not comment on the study app UI, delivery workflow, project-delivery.json, or repo architecture.",
    "Save a score from 0 to 100 and a short comment (max 480 chars, 2-4 plain sentences, no markdown headers) on the latest delivery.",
  ].join("\n");
}

export function buildSocraticCursorPrompt(ctx: DeliveryPromptContext): string {
  const moduleLabel = ctx.courseTitle || ctx.courseId;
  const topicLine = ctx.topicTitle ? ` · topic ${ctx.topicTitle}` : "";

  return [
    "Use the teacher-socratic skill to help me learn this project (hints first — no full solution unless I ask).",
    "",
    `Module: ${moduleLabel} (${ctx.courseId})`,
    `Project: ${ctx.projectTitle} (${ctx.projectId})${topicLine}`,
    "",
    "I'm working on this PBL exercise and have a conceptual question. Guide me with Socratic questions tied to this module and project.",
  ].join("\n");
}
