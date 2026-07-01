import { useCallback, useState } from "react";
import type { ProjectRunErrorCode, ProjectRunResult } from "../../domain/types/projectRun";
import { runProjectStarter } from "../usecases/runProjectStarter";

export function useProjectRun(input: {
  courseId: string;
  rootPath: string;
  draft: string;
  sampleInput?: string | null;
  enabled: boolean;
}) {
  const { courseId, rootPath, draft, sampleInput, enabled } = input;
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ProjectRunResult | null>(null);
  const [error, setError] = useState<ProjectRunErrorCode | "dev_server" | null>(null);

  const run = useCallback(async () => {
    if (!enabled) return;
    setRunning(true);
    setError(null);
    try {
      const outcome = await runProjectStarter({ courseId, rootPath, draft, sampleInput });
      if (!outcome) {
        setError("dev_server");
        setResult(null);
        return;
      }
      if (outcome.status === "error") {
        setError(outcome.code);
        setResult(null);
        return;
      }
      setResult(outcome.result);
      setError(null);
    } finally {
      setRunning(false);
    }
  }, [courseId, rootPath, draft, sampleInput, enabled]);

  return { running, result, error, run };
};
