import { useCallback, useMemo, useState } from "react";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useContentGraph } from "../../../application/hooks/useContentGraph";
import { useContentGraphScores } from "../../../application/hooks/useContentGraphScores";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import {
  buildCatalogLessonIndex,
  countEnrichedLessonStats,
  enrichContentGraphWithCatalog,
} from "../../../application/selectors/contentGraphCatalog";
import type { ContentGraphNode } from "../../../domain/types/contentGraph";
import { ErrorPanel, LoadingState } from "../../design-system";
import { MindMapCanvas } from "./MindMapCanvas";

function coveragePercent(exists: number, totalLeaves: number): number {
  if (totalLeaves <= 0) return 0;
  return Math.round((exists / totalLeaves) * 100);
}

export function ContentMapPanel() {
  const { status, graph, error, reload } = useContentGraph();
  const { courses } = useCatalog();
  const { goLesson } = useAppNavigation();
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());

  const enrichedRoot = useMemo(() => {
    if (!graph?.root) return null;
    const catalogIndex = buildCatalogLessonIndex(courses, graph.courseSlug);
    return enrichContentGraphWithCatalog(graph.root, catalogIndex);
  }, [graph?.root, graph?.courseSlug, courses]);

  const scores = useContentGraphScores(enrichedRoot, courses);

  const lessonStats = useMemo(() => {
    if (!enrichedRoot) return { exists: 0, planned: 0, totalLeaves: 0 };
    const counts = countEnrichedLessonStats(enrichedRoot);
    return {
      ...counts,
      totalLeaves: counts.exists + counts.planned,
    };
  }, [enrichedRoot]);

  const coverage = coveragePercent(lessonStats.exists, lessonStats.totalLeaves);

  const branchNodeIds = useMemo(() => {
    const root = enrichedRoot;
    if (!root) return [];
    const ids: string[] = [];
    function walk(node: ContentGraphNode) {
      if (node.children.length > 0) ids.push(node.id);
      for (const child of node.children) walk(child);
    }
    walk(root);
    return ids;
  }, [enrichedRoot]);

  const toggleCollapse = useCallback((nodeId: string) => {
    setCollapsedIds((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setCollapsedIds(new Set(branchNodeIds));
  }, [branchNodeIds]);

  const expandAll = useCallback(() => {
    setCollapsedIds(new Set());
  }, []);

  if (status === "loading" || status === "idle") {
    return <LoadingState message="Loading content map…" />;
  }

  if (status === "error" || !graph || !enrichedRoot) {
    return (
      <ErrorPanel
        title="Content map unavailable"
        message={error ?? "Content graph failed to load."}
        onRetry={() => void reload()}
      />
    );
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="m-0 text-body font-semibold text-text0">Content Map</h2>
          <p className="m-0 mt-1 text-meta text-text1">
            {lessonStats.exists} exists · {lessonStats.planned} planned · {coverage}% coverage
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-meta font-medium text-text0 transition hover:bg-surfacePanel"
            onClick={expandAll}
          >
            Expand all
          </button>
          <button
            type="button"
            className="rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-meta font-medium text-text0 transition hover:bg-surfacePanel"
            onClick={collapseAll}
          >
            Collapse all
          </button>
        </div>
      </div>

      <MindMapCanvas
        root={enrichedRoot}
        courseSlug={graph.courseSlug}
        collapsedIds={collapsedIds}
        scores={scores}
        onToggleCollapse={toggleCollapse}
        onOpenLesson={(catalogRef) =>
          goLesson(catalogRef.courseId, catalogRef.moduleId, catalogRef.lessonId)
        }
      />
    </section>
  );
}
