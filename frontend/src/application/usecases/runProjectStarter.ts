import type { ProjectRunOutcome } from "../../domain/types/projectRun";
import { getProjectRunRepository } from "./projectRun";
import { resolveRunCodeFromDraft } from "./extractStarterIndexFromDraft";

export async function runProjectStarter(input: {
  courseId: string;
  rootPath: string;
  draft: string;
}): Promise<ProjectRunOutcome | null> {
  const repository = getProjectRunRepository();
  if (!repository) return null;

  const code = resolveRunCodeFromDraft(input.draft);
  return repository.run(input.courseId, input.rootPath, code);
}
