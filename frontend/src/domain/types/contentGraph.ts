export type ContentGraphNodeKind = "root" | "module" | "section" | "lesson";

export type ContentGraphNodeStatus = "exists" | "planned" | "orphan";

export type ContentGraphCatalogRef = {
  courseId: string;
  moduleId: string;
  lessonId: string;
};

export type ContentGraphNode = {
  id: string;
  graphIndex: string | null;
  label: string;
  kind: ContentGraphNodeKind;
  children: ContentGraphNode[];
  status?: ContentGraphNodeStatus;
  catalogRef?: ContentGraphCatalogRef;
};

export type ContentGraphStats = {
  totalLeaves: number;
  exists: number;
  planned: number;
  orphan: number;
};

export type ContentGraph = {
  generatedAt: string;
  courseSlug: string;
  stats: ContentGraphStats;
  root: ContentGraphNode;
};
