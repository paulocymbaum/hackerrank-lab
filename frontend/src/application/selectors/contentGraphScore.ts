import type { Course } from "../../domain/types/catalog";
import type { ContentGraphNode } from "../../domain/types/contentGraph";
import { quizProgressKey } from "../../domain/types/quiz";
import {
  computeCoursePoints,
  projectProgressKey,
  withCourseMaxPointsFromItems,
  type ProjectStatus,
} from "../../domain/types/quizScore";
import {
  getCourseById,
  getLessonById,
  getProjectsForLesson,
  getQuizzesForLesson,
} from "./catalogSelectors";

export type NodeScore = {
  points: { value: number; max: number };
  activities: { done: number; total: number };
};

export type ProgressSnapshot = {
  quizByKey: Record<string, { bestScore?: number } | undefined>;
  projectByKey: Record<string, { status?: ProjectStatus } | undefined>;
};

function computeLessonNodeScore(input: {
  course: Course;
  moduleId: string;
  lessonId: string;
  progress: ProgressSnapshot;
}): NodeScore {
  const quizzes = getQuizzesForLesson(input.course, input.moduleId, input.lessonId);
  const projects = getProjectsForLesson(input.course, input.moduleId, input.lessonId);

  if (quizzes.length === 0 && projects.length === 0) {
    return {
      points: { value: 0, max: 0 },
      activities: { done: 0, total: 0 },
    };
  }

  const quizBestScores = quizzes.map(
    (quiz) =>
      input.progress.quizByKey[
        quizProgressKey(input.course.id, quiz.id, input.lessonId)
      ]?.bestScore ?? 0,
  );
  const projectStatuses = projects.map(
    (project) =>
      input.progress.projectByKey[
        projectProgressKey(input.course.id, project.id, input.lessonId)
      ]?.status ?? "pending",
  );

  const points = withCourseMaxPointsFromItems(
    quizzes,
    projects.length,
    computeCoursePoints({ quizBestScores, projectStatuses }),
  );

  const quizDone = quizBestScores.filter((score) => score > 0).length;
  const projectDone = projectStatuses.filter((status) => status === "done").length;

  return {
    points: { value: points.totalPoints, max: points.totalMax },
    activities: {
      done: quizDone + projectDone,
      total: quizzes.length + projects.length,
    },
  };
}

function addScores(base: NodeScore, next: NodeScore): NodeScore {
  return {
    points: {
      value: base.points.value + next.points.value,
      max: base.points.max + next.points.max,
    },
    activities: {
      done: base.activities.done + next.activities.done,
      total: base.activities.total + next.activities.total,
    },
  };
}

function computeNodeScoreRecursive(
  node: ContentGraphNode,
  courses: Course[],
  progress: ProgressSnapshot,
): NodeScore | null {
  if (node.kind === "lesson") {
    if (node.status !== "exists" || !node.catalogRef) return null;
    const course = getCourseById(courses, node.catalogRef.courseId);
    if (!course) return null;
    const lesson = getLessonById(course, node.catalogRef.moduleId, node.catalogRef.lessonId);
    if (!lesson) return null;
    return computeLessonNodeScore({
      course,
      moduleId: node.catalogRef.moduleId,
      lessonId: node.catalogRef.lessonId,
      progress,
    });
  }

  let rollup: NodeScore | null = null;
  for (const child of node.children) {
    const childScore = computeNodeScoreRecursive(child, courses, progress);
    if (!childScore) continue;
    if (childScore.points.max === 0 && childScore.activities.total === 0) continue;
    rollup = rollup ? addScores(rollup, childScore) : childScore;
  }
  return rollup;
}

export function buildContentGraphScores(
  root: ContentGraphNode,
  courses: Course[],
  progress: ProgressSnapshot,
): Map<string, NodeScore> {
  const scores = new Map<string, NodeScore>();

  function walk(node: ContentGraphNode) {
    const score = computeNodeScoreRecursive(node, courses, progress);
    if (score) scores.set(node.id, score);
    for (const child of node.children) walk(child);
  }

  walk(root);
  return scores;
}

export function mergeNodeScores(scores: NodeScore[]): NodeScore | null {
  return scores.reduce<NodeScore | null>(
    (acc, score) => (acc ? addScores(acc, score) : score),
    null,
  );
}
