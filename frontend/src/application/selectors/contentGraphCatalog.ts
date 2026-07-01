import type { Course } from "../../domain/types/catalog";
import type { ContentGraphCatalogRef, ContentGraphNode } from "../../domain/types/contentGraph";
import { getLessonDisplayIndex } from "./lessonDisplay";
import { isHierarchyCourse } from "./catalogSelectors";

export function buildCatalogLessonIndex(
  courses: Course[],
  preferCourseId?: string,
): Map<string, ContentGraphCatalogRef> {
  const index = new Map<string, ContentGraphCatalogRef>();

  for (const course of courses) {
    if (!isHierarchyCourse(course)) continue;
    for (const mod of course.modules ?? []) {
      for (const lesson of mod.lessons) {
        const graphIndex = getLessonDisplayIndex(lesson);
        const entry: ContentGraphCatalogRef = {
          courseId: course.id,
          moduleId: mod.id,
          lessonId: lesson.id,
        };
        const existing = index.get(graphIndex);
        if (!existing || course.id === preferCourseId) {
          index.set(graphIndex, entry);
        }
      }
    }
  }

  return index;
}

export function enrichContentGraphWithCatalog(
  root: ContentGraphNode,
  catalogIndex: Map<string, ContentGraphCatalogRef>,
): ContentGraphNode {
  function walk(node: ContentGraphNode): ContentGraphNode {
    const children = node.children.map(walk);

    if (node.kind !== "lesson" || !node.graphIndex) {
      return { ...node, children };
    }

    const catalogRef = catalogIndex.get(node.graphIndex);
    if (catalogRef) {
      return {
        ...node,
        children,
        status: "exists",
        catalogRef,
      };
    }

    return {
      ...node,
      children,
      status: "planned",
      catalogRef: undefined,
    };
  }

  return walk(root);
}

export function countEnrichedLessonStats(root: ContentGraphNode): {
  exists: number;
  planned: number;
} {
  let exists = 0;
  let planned = 0;

  function walk(node: ContentGraphNode) {
    if (node.kind === "lesson") {
      if (node.status === "exists") exists += 1;
      else planned += 1;
    }
    for (const child of node.children) walk(child);
  }

  walk(root);
  return { exists, planned };
}
