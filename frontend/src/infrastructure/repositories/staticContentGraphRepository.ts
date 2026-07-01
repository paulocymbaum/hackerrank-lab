import type { ContentGraphRepository } from "../../domain/repositories/contentGraphRepository";
import type { ContentGraph } from "../../domain/types/contentGraph";
import contentGraphJson from "../static/content-graph.json";

export const staticContentGraphRepository: ContentGraphRepository = {
  getContentGraph: async (): Promise<ContentGraph> => contentGraphJson as ContentGraph,
};
