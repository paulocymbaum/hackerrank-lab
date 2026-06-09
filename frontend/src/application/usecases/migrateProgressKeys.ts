import type { Catalog } from "../../domain/types/catalog";
import {
  legacyProjectProgressKey,
  legacyQuizProgressKey,
  projectProgressKey,
} from "../../domain/types/quizScore";
import { quizProgressKey } from "../../domain/types/quiz";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizSessionStore";

const MIGRATION_FLAG = "score-migration-v1";

const LEGACY_COURSE_TO_SLUG: Record<string, string> = {
  "01-javascript-fundamentals": "javascript",
  "02-objects-references-and-copying": "javascript",
  "03-asynchronous-javascript-runtime-model-event-loop": "javascript",
};

function buildProjectLessonMap(catalog: Catalog): Map<string, string> {
  const map = new Map<string, string>();
  for (const course of catalog.courses) {
    for (const project of course.projects) {
      if (project.lessonId) map.set(project.id, project.lessonId);
    }
    for (const mod of course.modules ?? []) {
      for (const project of mod.projects) {
        if (project.lessonId) map.set(project.id, project.lessonId);
      }
    }
  }
  return map;
}

function buildQuizLessonMap(catalog: Catalog): Map<string, string> {
  const map = new Map<string, string>();
  for (const course of catalog.courses) {
    for (const quiz of course.quizzes) {
      if (quiz.lessonId) map.set(quiz.id, quiz.lessonId);
    }
    for (const mod of course.modules ?? []) {
      for (const quiz of mod.quizzes) {
        if (quiz.lessonId) map.set(quiz.id, quiz.lessonId);
      }
    }
  }
  return map;
}

function remapQuizKeys(
  byKey: Record<string, unknown>,
  projectLessonMap: Map<string, string>,
  quizLessonMap: Map<string, string>,
): Record<string, unknown> {
  const next = { ...byKey };

  for (const [oldKey, value] of Object.entries(byKey)) {
    const colon = oldKey.indexOf(":");
    if (colon <= 0) continue;

    const coursePart = oldKey.slice(0, colon);
    const rest = oldKey.slice(colon + 1);

    if (rest.startsWith("quiz:") || rest.startsWith("project:")) continue;

    const targetCourse = LEGACY_COURSE_TO_SLUG[coursePart] ?? coursePart;
    const isProject = projectLessonMap.has(rest);
    const lessonId = isProject
      ? projectLessonMap.get(rest)
      : quizLessonMap.get(rest);

    const newKey = isProject
      ? projectProgressKey(targetCourse, rest, lessonId)
      : quizProgressKey(targetCourse, rest, lessonId);

    if (!(newKey in next)) next[newKey] = value;
    if (oldKey !== newKey) delete next[oldKey];
  }

  return next;
}

export function migrateProgressKeysFromCatalog(catalog: Catalog): void {
  if (typeof localStorage === "undefined") return;
  if (localStorage.getItem(MIGRATION_FLAG) === "done") return;

  const projectLessonMap = buildProjectLessonMap(catalog);
  const quizLessonMap = buildQuizLessonMap(catalog);

  const quizState = useQuizProgressStore.getState();
  const projectState = useProjectProgressStore.getState();

  useQuizProgressStore.setState({
    byKey: remapQuizKeys(
      quizState.byKey as Record<string, unknown>,
      projectLessonMap,
      quizLessonMap,
    ) as typeof quizState.byKey,
  });

  useProjectProgressStore.setState({
    byKey: remapQuizKeys(
      projectState.byKey as Record<string, unknown>,
      projectLessonMap,
      quizLessonMap,
    ) as typeof projectState.byKey,
  });

  localStorage.setItem(MIGRATION_FLAG, "done");
}

/** Resolve progress with legacy key fallback */
export function resolveQuizProgressKey(
  courseId: string,
  quizId: string,
  lessonId?: string,
  byKey?: Record<string, unknown>,
): string {
  const key = quizProgressKey(courseId, quizId, lessonId);
  if (byKey && byKey[key] !== undefined) return key;
  const legacy = legacyQuizProgressKey(courseId, quizId);
  if (byKey && byKey[legacy] !== undefined) return legacy;
  return key;
}

export function resolveProjectProgressKey(
  courseId: string,
  projectId: string,
  lessonId?: string,
  byKey?: Record<string, unknown>,
): string {
  const key = projectProgressKey(courseId, projectId, lessonId);
  if (byKey && byKey[key] !== undefined) return key;
  const legacy = legacyProjectProgressKey(courseId, projectId);
  if (byKey && byKey[legacy] !== undefined) return legacy;
  return key;
}
