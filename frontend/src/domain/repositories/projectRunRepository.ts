import type { ProjectRunOutcome } from "../types/projectRun";

export type ProjectRunRepository = {
  run(
    courseId: string,
    rootPath: string,
    code?: string,
    sampleInput?: string,
  ): Promise<ProjectRunOutcome | null>;
};
