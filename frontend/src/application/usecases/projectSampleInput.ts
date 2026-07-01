import type { ReaderEntry } from "../../domain/types/reader";

export const PROJECT_SAMPLE_INPUT_PATH = "starter/sample.input";
export const PROJECT_STARTER_INDEX_PATH = "starter/index.js";

export function normalizeSampleInput(content: string): string {
  return content
    .split("\n")
    .filter((line) => !line.trim().startsWith("#"))
    .join("\n")
    .trimEnd();
}

export function hasUsableSampleInput(content: string | undefined): boolean {
  if (content === undefined) return false;
  return normalizeSampleInput(content).length > 0;
}

export function hasProjectSampleInput(entries: ReaderEntry[]): boolean {
  return getProjectSampleInput(entries) !== null;
}

export function getProjectSampleInput(entries: ReaderEntry[]): string | null {
  const file = entries.find(
    (entry) => entry.kind === "file" && entry.path === PROJECT_SAMPLE_INPUT_PATH,
  );
  if (!hasUsableSampleInput(file?.content)) return null;
  return normalizeSampleInput(file!.content!);
}
