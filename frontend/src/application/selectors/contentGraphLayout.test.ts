import { describe, expect, it } from "vitest";
import { hierarchy } from "d3-hierarchy";
import type { ContentGraphNode } from "../../domain/types/contentGraph";
import type { NodeScore } from "./contentGraphScore";
import {
  assertNoSiblingOverlaps,
  estimateMindMapNodeHeight,
  layoutContentGraphMindMap,
  MIND_MAP_VERTICAL_GAP,
  pruneContentGraphTree,
} from "./contentGraphLayout";

const sampleRoot: ContentGraphNode = {
  id: "root",
  graphIndex: null,
  label: "JavaScript",
  kind: "root",
  children: [
    {
      id: "mod-01",
      graphIndex: "01",
      label: "Fundamentals",
      kind: "module",
      children: [
        {
          id: "sec-01-1",
          graphIndex: "01.1",
          label: "Getting Started",
          kind: "section",
          children: [
            {
              id: "lesson-01-1-1",
              graphIndex: "01.1.1",
              label: "Running JavaScript",
              kind: "lesson",
              children: [],
              status: "exists",
            },
            {
              id: "lesson-01-1-2",
              graphIndex: "01.1.2",
              label: "Output",
              kind: "lesson",
              children: [],
              status: "planned",
            },
            {
              id: "lesson-01-1-3",
              graphIndex: "01.1.3",
              label: "Comments",
              kind: "lesson",
              children: [],
              status: "exists",
            },
          ],
        },
      ],
    },
    {
      id: "mod-02",
      graphIndex: "02",
      label: "Objects",
      kind: "module",
      children: [],
    },
  ],
};

const scoredLessonScore: NodeScore = {
  points: { value: 5, max: 10 },
  activities: { done: 1, total: 2 },
};

describe("pruneContentGraphTree", () => {
  it("removes children for collapsed nodes", () => {
    const pruned = pruneContentGraphTree(sampleRoot, new Set(["mod-01"]));
    expect(pruned.children[0]?.children).toEqual([]);
    expect(pruned.children[1]?.id).toBe("mod-02");
  });
});

describe("layoutContentGraphMindMap", () => {
  it("includes all nodes when expanded", () => {
    const layout = layoutContentGraphMindMap(sampleRoot);
    expect(layout.nodes).toHaveLength(7);
    expect(layout.stems.length).toBeGreaterThan(0);
    expect(layout.width).toBeGreaterThan(800);
    expect(layout.height).toBeGreaterThan(200);
  });

  it("hides collapsed subtree nodes and stems", () => {
    const expanded = layoutContentGraphMindMap(sampleRoot);
    const collapsed = layoutContentGraphMindMap(sampleRoot, new Set(["mod-01"]));
    expect(collapsed.nodes.length).toBeLessThan(expanded.nodes.length);
    expect(collapsed.stems.length).toBeLessThan(expanded.stems.length);
    expect(collapsed.nodes.some((n) => n.node.id === "lesson-01-1-1")).toBe(false);
    expect(collapsed.nodes.some((n) => n.node.id === "mod-01")).toBe(true);
  });

  it("does not overlap siblings", () => {
    const scores = new Map<string, NodeScore>([["lesson-01-1-1", scoredLessonScore]]);
    const layout = layoutContentGraphMindMap(sampleRoot, new Set(), scores);
    expect(() => assertNoSiblingOverlaps(sampleRoot, new Set(), layout)).not.toThrow();
  });

  it("matches stem count to hierarchy links", () => {
    const layout = layoutContentGraphMindMap(sampleRoot);
    const visibleRoot = pruneContentGraphTree(sampleRoot, new Set());
    const links = hierarchy(visibleRoot, (node) => [...node.children]).links();
    expect(layout.stems).toHaveLength(links.length);
  });

  it("keeps stem endpoints inside canvas bounds", () => {
    const layout = layoutContentGraphMindMap(sampleRoot);
    for (const stem of layout.stems) {
      expect(stem.from.x).toBeGreaterThanOrEqual(0);
      expect(stem.to.x).toBeLessThanOrEqual(layout.width);
      expect(stem.from.y).toBeGreaterThanOrEqual(0);
      expect(stem.to.y).toBeLessThanOrEqual(layout.height);
      expect(stem.from.x).toBeLessThan(stem.to.x);
    }
  });

  it("spaces scored nodes using taller estimates", () => {
    const scores = new Map<string, NodeScore>([["lesson-01-1-1", scoredLessonScore]]);
    const layout = layoutContentGraphMindMap(sampleRoot, new Set(), scores);
    const lesson1 = layout.nodes.find((node) => node.node.id === "lesson-01-1-1");
    const lesson2 = layout.nodes.find((node) => node.node.id === "lesson-01-1-2");
    expect(lesson1).toBeDefined();
    expect(lesson2).toBeDefined();
    expect(lesson2!.y - lesson1!.y).toBeGreaterThanOrEqual(
      estimateMindMapNodeHeight(lesson1!.node, scoredLessonScore) + MIND_MAP_VERTICAL_GAP,
    );
  });

  it("adds skill action height for lesson nodes", () => {
    const existsLesson = sampleRoot.children[0]!.children[0]!.children[0]!;
    const plannedLesson = sampleRoot.children[0]!.children[0]!.children[1]!;
    const baseExists = estimateMindMapNodeHeight(existsLesson, scoredLessonScore);
    const basePlanned = estimateMindMapNodeHeight(plannedLesson);
    expect(baseExists).toBeGreaterThan(120);
    expect(basePlanned).toBeGreaterThan(100);
  });
});
