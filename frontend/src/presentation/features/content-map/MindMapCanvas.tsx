import { useMemo } from "react";
import { Crosshair } from "lucide-react";
import type { NodeScore } from "../../../application/selectors/contentGraphScore";
import {
  layoutContentGraphMindMap,
  MIND_MAP_NODE_WIDTH,
} from "../../../application/selectors/contentGraphLayout";
import type { ContentGraphNode } from "../../../domain/types/contentGraph";
import { Button, Icon } from "../../design-system";
import { MindMapNodeCard } from "./MindMapNode";
import { MindMapStemLayer } from "./MindMapStem";
import { useMindMapZoom } from "./useMindMapZoom";

export function MindMapCanvas(props: {
  root: ContentGraphNode;
  courseSlug: string;
  collapsedIds: ReadonlySet<string>;
  scores: Map<string, NodeScore>;
  onToggleCollapse: (nodeId: string) => void;
  onOpenLesson: (catalogRef: NonNullable<ContentGraphNode["catalogRef"]>) => void;
}) {
  const layout = useMemo(
    () => layoutContentGraphMindMap(props.root, props.collapsedIds, props.scores),
    [props.root, props.collapsedIds, props.scores],
  );

  const rootFocusRect = useMemo(() => {
    const rootNode = layout.nodes.find((node) => node.depth === 0) ?? layout.nodes[0];
    if (!rootNode) return null;
    return {
      x: rootNode.x,
      y: rootNode.y,
      width: MIND_MAP_NODE_WIDTH,
      height: rootNode.height,
    };
  }, [layout.nodes]);

  const { viewportRef, surfaceRef, centerView, zoomToRect } = useMindMapZoom({
    contentWidth: layout.width,
    contentHeight: layout.height,
    rootFocusRect,
  });

  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-3 top-3 z-10">
        <Button
          variant="secondary"
          size="md"
          className="pointer-events-auto shadow-glass1"
          onClick={() => centerView()}
          title="Center view"
          aria-label="Center view on root node"
        >
          <Icon icon={Crosshair} />
          Center view
        </Button>
      </div>

      <div
        ref={viewportRef}
        className="h-[min(70vh,720px)] min-h-[420px] cursor-grab overflow-hidden rounded-panel border border-border0 bg-surfacePanel/40 active:cursor-grabbing"
        data-mindmap-viewport
        aria-label="Content map canvas. Scroll to zoom. Drag the background to pan. Double-click a node to focus it."
      >
        <div
          ref={surfaceRef}
          className="relative origin-top-left touch-none"
          data-mindmap-pan-surface
          style={{ width: layout.width, height: layout.height }}
        >
          <MindMapStemLayer stems={layout.stems} width={layout.width} height={layout.height} />

          {layout.nodes.map((positioned) => (
            <MindMapNodeCard
              key={positioned.node.id}
              node={positioned.node}
              courseSlug={props.courseSlug}
              x={positioned.x}
              y={positioned.y}
              height={positioned.height}
              collapsed={positioned.collapsed}
              hasChildren={positioned.hasChildren}
              score={props.scores.get(positioned.node.id) ?? null}
              onToggleCollapse={() => props.onToggleCollapse(positioned.node.id)}
              onOpenLesson={
                positioned.node.catalogRef
                  ? () => props.onOpenLesson(positioned.node.catalogRef!)
                  : undefined
              }
              onFocus={() =>
                zoomToRect({
                  x: positioned.x,
                  y: positioned.y,
                  width: MIND_MAP_NODE_WIDTH,
                  height: positioned.height,
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
