import { hierarchy } from "d3-hierarchy";
import type { ContentGraphNode } from "../../domain/types/contentGraph";
import type { NodeScore } from "./contentGraphScore";

export type MindMapPoint = { x: number; y: number };

export type PositionedNode = {
  node: ContentGraphNode;
  x: number;
  y: number;
  height: number;
  depth: number;
  collapsed: boolean;
  hasChildren: boolean;
};

export type MindMapStem = {
  id: string;
  from: MindMapPoint;
  to: MindMapPoint;
};

export type MindMapLayout = {
  nodes: PositionedNode[];
  stems: MindMapStem[];
  width: number;
  height: number;
};

export const MIND_MAP_NODE_WIDTH = 220;
export const MIND_MAP_NODE_HEIGHT = 80;
export const MIND_MAP_HORIZONTAL_GAP = 140;
export const MIND_MAP_VERTICAL_GAP = 24;
export const MIND_MAP_PADDING = 32;

const BASE_NODE_HEIGHT = 80;
const SCORE_BLOCK_HEIGHT = 40;
const SKILL_ACTIONS_HEIGHT = 28;

export function estimateMindMapNodeHeight(
  node: ContentGraphNode,
  score?: NodeScore | null,
): number {
  const hasScorePanel =
    Boolean(score && (score.points.max > 0 || score.activities.total > 0)) ||
    (node.kind === "lesson" && node.status === "exists");
  const skillActionsHeight = node.kind === "lesson" ? SKILL_ACTIONS_HEIGHT : 0;
  if (hasScorePanel) return BASE_NODE_HEIGHT + SCORE_BLOCK_HEIGHT + skillActionsHeight;
  return BASE_NODE_HEIGHT + skillActionsHeight;
}

function compareNodes(a: ContentGraphNode, b: ContentGraphNode): number {
  const ai = a.graphIndex ?? "";
  const bi = b.graphIndex ?? "";
  return ai.localeCompare(bi, "en", { numeric: true });
}

function sortedChildren(node: ContentGraphNode): ContentGraphNode[] {
  return [...node.children].sort(compareNodes);
}

function buildChildCountMap(root: ContentGraphNode): Map<string, number> {
  const counts = new Map<string, number>();
  function walk(node: ContentGraphNode) {
    counts.set(node.id, node.children.length);
    for (const child of node.children) walk(child);
  }
  walk(root);
  return counts;
}

export function pruneContentGraphTree(
  root: ContentGraphNode,
  collapsedIds: ReadonlySet<string>,
): ContentGraphNode {
  function walk(node: ContentGraphNode): ContentGraphNode {
    const collapsed = collapsedIds.has(node.id);
    return {
      ...node,
      children: collapsed ? [] : node.children.map(walk),
    };
  }
  return walk(root);
}

type LayoutContext = {
  collapsedIds: ReadonlySet<string>;
  childCountById: Map<string, number>;
  scores: Map<string, NodeScore>;
  nodes: PositionedNode[];
};

function layoutSubtree(
  node: ContentGraphNode,
  depth: number,
  yStart: number,
  context: LayoutContext,
): { blockHeight: number } {
  const x = MIND_MAP_PADDING + depth * (MIND_MAP_NODE_WIDTH + MIND_MAP_HORIZONTAL_GAP);
  const collapsed = context.collapsedIds.has(node.id);
  const hasChildren = (context.childCountById.get(node.id) ?? 0) > 0;
  const visibleChildren = sortedChildren(node);
  const nodeHeight = estimateMindMapNodeHeight(node, context.scores.get(node.id));

  if (visibleChildren.length === 0) {
    context.nodes.push({
      node,
      x,
      y: yStart,
      height: nodeHeight,
      depth,
      collapsed,
      hasChildren,
    });
    return { blockHeight: nodeHeight };
  }

  let cursorY = yStart;
  for (const child of visibleChildren) {
    const childLayout = layoutSubtree(child, depth + 1, cursorY, context);
    cursorY += childLayout.blockHeight + MIND_MAP_VERTICAL_GAP;
  }

  const childrenBlockHeight = cursorY - yStart - MIND_MAP_VERTICAL_GAP;
  const blockHeight = Math.max(nodeHeight, childrenBlockHeight);
  const nodeY = yStart + (blockHeight - nodeHeight) / 2;

  context.nodes.push({
    node,
    x,
    y: nodeY,
    height: nodeHeight,
    depth,
    collapsed,
    hasChildren,
  });

  return { blockHeight };
}

function buildStems(
  hierarchyRoot: ReturnType<typeof hierarchy<ContentGraphNode>>,
  positionedById: Map<string, PositionedNode>,
): MindMapStem[] {
  const stems: MindMapStem[] = [];

  for (const link of hierarchyRoot.links()) {
    const parent = positionedById.get(link.source.data.id);
    const child = positionedById.get(link.target.data.id);
    if (!parent || !child) continue;
    if (parent.x + MIND_MAP_NODE_WIDTH >= child.x - 2) continue;

    stems.push({
      id: `${parent.node.id}->${child.node.id}`,
      from: {
        x: parent.x + MIND_MAP_NODE_WIDTH,
        y: parent.y + parent.height / 2,
      },
      to: {
        x: child.x,
        y: child.y + child.height / 2,
      },
    });
  }

  return stems;
}

export function layoutContentGraphMindMap(
  root: ContentGraphNode,
  collapsedIds: ReadonlySet<string> = new Set(),
  scores: Map<string, NodeScore> = new Map(),
): MindMapLayout {
  const childCountById = buildChildCountMap(root);
  const visibleRoot = pruneContentGraphTree(root, collapsedIds);
  const hierarchyRoot = hierarchy(visibleRoot, (node) => sortedChildren(node));

  const context: LayoutContext = {
    collapsedIds,
    childCountById,
    scores,
    nodes: [],
  };

  layoutSubtree(visibleRoot, 0, MIND_MAP_PADDING, context);

  const positionedById = new Map(context.nodes.map((positioned) => [positioned.node.id, positioned]));
  const stems = buildStems(hierarchyRoot, positionedById);

  const maxX = context.nodes.reduce(
    (max, positioned) => Math.max(max, positioned.x + MIND_MAP_NODE_WIDTH),
    MIND_MAP_PADDING,
  );
  const maxY = context.nodes.reduce(
    (max, positioned) => Math.max(max, positioned.y + positioned.height),
    MIND_MAP_PADDING,
  );

  return {
    nodes: context.nodes,
    stems,
    width: maxX + MIND_MAP_PADDING,
    height: maxY + MIND_MAP_PADDING,
  };
}

export function collectDescendantIds(node: ContentGraphNode): string[] {
  const ids: string[] = [];
  function walk(current: ContentGraphNode) {
    for (const child of current.children) {
      ids.push(child.id);
      walk(child);
    }
  }
  walk(node);
  return ids;
}

export function findContentGraphNode(
  root: ContentGraphNode,
  nodeId: string,
): ContentGraphNode | null {
  if (root.id === nodeId) return root;
  for (const child of root.children) {
    const found = findContentGraphNode(child, nodeId);
    if (found) return found;
  }
  return null;
}

export function assertNoSiblingOverlaps(
  root: ContentGraphNode,
  collapsedIds: ReadonlySet<string>,
  layout: MindMapLayout,
): void {
  const visibleRoot = pruneContentGraphTree(root, collapsedIds);
  const positionedById = new Map(layout.nodes.map((positioned) => [positioned.node.id, positioned]));

  function walk(parent: ContentGraphNode) {
    const siblings = sortedChildren(parent)
      .map((child) => positionedById.get(child.id))
      .filter((positioned): positioned is PositionedNode => Boolean(positioned))
      .sort((a, b) => a.y - b.y);

    for (let i = 1; i < siblings.length; i += 1) {
      const prev = siblings[i - 1];
      const current = siblings[i];
      const minY = prev.y + prev.height + MIND_MAP_VERTICAL_GAP;
      if (current.y < minY - 0.5) {
        throw new Error(
          `Sibling overlap: ${prev.node.id} and ${current.node.id} (${current.y} < ${minY})`,
        );
      }
    }

    for (const child of sortedChildren(parent)) walk(child);
  }

  walk(visibleRoot);
}
