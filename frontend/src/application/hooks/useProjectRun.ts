import { useCallback, useEffect, useState } from "react";
import type { ProjectRunErrorCode, ProjectTestMatrixResult } from "../../domain/types/projectRun";
import { runProjectStarter } from "../usecases/runProjectStarter";

function projectRunKey(courseId: string, rootPath: string): string {
  return `${courseId}:${rootPath}`;
}

export function useProjectRun(input: {
  courseId: string;
  rootPath: string;
  draft: string;
  enabled: boolean;
}) {
  const { courseId, rootPath, draft, enabled } = input;
  const activeProjectKey = projectRunKey(courseId, rootPath);
  const [running, setRunning] = useState(false);
  const [matrix, setMatrix] = useState<ProjectTestMatrixResult | null>(null);
  const [matrixProjectKey, setMatrixProjectKey] = useState<string | null>(null);
  const [error, setError] = useState<ProjectRunErrorCode | "dev_server" | null>(null);

  useEffect(() => {
    setRunning(false);
    setMatrix(null);
    setMatrixProjectKey(null);
    setError(null);
  }, [activeProjectKey]);

  const run = useCallback(async () => {
    if (!enabled) return;
    setRunning(true);
    setError(null);
    try {
      const outcome = await runProjectStarter({ courseId, rootPath, draft });
      if (!outcome) {
        setError("dev_server");
        setMatrix(null);
        setMatrixProjectKey(null);
        return;
      }
      if (outcome.status === "error") {
        setError(outcome.code);
        setMatrix(null);
        setMatrixProjectKey(null);
        return;
      }
      setMatrix(outcome.matrix);
      setMatrixProjectKey(activeProjectKey);
      setError(null);
    } finally {
      setRunning(false);
    }
  }, [courseId, rootPath, draft, enabled, activeProjectKey]);

  const matrixForProject =
    matrix && matrixProjectKey === activeProjectKey ? matrix : null;

  return { running, matrix: matrixForProject, error, run };
}
