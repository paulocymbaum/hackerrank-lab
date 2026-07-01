import type { ContentGraph } from "../types/contentGraph";

export interface ContentGraphRepository {
  getContentGraph(): Promise<ContentGraph>;
}
