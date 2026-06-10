import type { Lesson, Module } from "../../domain/types/catalog";

/** Section labels from `graph/course.graph.json` (topic nodes, not leaf lessons). */
const SECTION_LABELS: Record<string, string> = {
  "01.1": "Getting Started",
  "01.2": "Variables",
  "01.3": "Primitive Types",
  "01.4": "Operators",
  "01.5": "Control Flow",
  "01.6": "Loops",
  "01.7": "Functions",
  "01.8": "Truthiness and Coercion",
  "02.1": "Reference vs Value",
  "02.2": "Shallow vs Deep Copy",
  "02.3": "structuredClone",
  "02.4": "Object.hasOwn",
  "03.1": "Runtime Model",
  "03.2": "Async Patterns",
};

/** Extract leading graph index from lesson slug (e.g. `01.1.3-comments` → `01.1.3`). */
export function graphIndexFromLessonId(lessonId: string): string | undefined {
  const match = lessonId.match(/^(\d+(?:\.\d+)*)/);
  return match?.[1];
}

export function getLessonDisplayIndex(lesson: Pick<Lesson, "graphIndex" | "id">): string {
  return lesson.graphIndex ?? graphIndexFromLessonId(lesson.id) ?? lesson.id;
}

export function getModuleDisplayIndex(module: Pick<Module, "graphIndex" | "id">): string {
  return module.graphIndex ?? module.id.match(/^(\d+)/)?.[1] ?? module.id;
}

/** Topic group inside a module (e.g. `03.1.2` → `03.1`, `02.1` → `02.1`). */
export function getSectionKey(lesson: Pick<Lesson, "graphIndex" | "id">): string {
  const index = getLessonDisplayIndex(lesson);
  const parts = index.split(".");
  if (parts.length >= 3) return parts.slice(0, 2).join(".");
  return index;
}

export function getSectionLabel(sectionKey: string): string {
  return SECTION_LABELS[sectionKey] ?? sectionKey;
}

export function compareGraphIndex(
  aIndex: string | undefined,
  bIndex: string | undefined,
  aId: string,
  bId: string,
): number {
  const a = aIndex ?? graphIndexFromLessonId(aId) ?? aId;
  const b = bIndex ?? graphIndexFromLessonId(bId) ?? bId;
  return a.localeCompare(b, undefined, { numeric: true });
}

export function sortByGraphIndex<T extends { graphIndex?: string; id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => compareGraphIndex(a.graphIndex, b.graphIndex, a.id, b.id));
}

export type LessonSectionGroup<T extends { graphIndex?: string; id: string }> = {
  sectionKey: string;
  sectionLabel: string;
  lessons: T[];
};

export function groupLessonsBySection<T extends { graphIndex?: string; id: string }>(
  lessons: T[],
): LessonSectionGroup<T>[] {
  const sorted = sortByGraphIndex(lessons);
  const groups: LessonSectionGroup<T>[] = [];

  for (const lesson of sorted) {
    const sectionKey = getSectionKey(lesson);
    const last = groups[groups.length - 1];
    if (last?.sectionKey === sectionKey) {
      last.lessons.push(lesson);
    } else {
      groups.push({
        sectionKey,
        sectionLabel: getSectionLabel(sectionKey),
        lessons: [lesson],
      });
    }
  }

  return groups;
}
