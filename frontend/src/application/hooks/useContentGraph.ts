import { useCallback, useEffect, useState } from "react";
import type { ContentGraph } from "../../domain/types/contentGraph";
import { staticContentGraphRepository } from "../../infrastructure/repositories/staticContentGraphRepository";

type Status = "idle" | "loading" | "ready" | "error";

export function useContentGraph() {
  const [status, setStatus] = useState<Status>("idle");
  const [graph, setGraph] = useState<ContentGraph | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    if (!force && (status === "loading" || status === "ready")) return;

    setStatus("loading");
    setError(null);
    try {
      const data = await staticContentGraphRepository.getContentGraph();
      setGraph(data);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }, [status]);

  const reload = useCallback(() => load(true), [load]);

  useEffect(() => {
    void load();
  }, [load]);

  return { status, graph, error, reload };
}
