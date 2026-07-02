import type { ReaderEntry } from "../../domain/types/reader";

const STARTER_PREFIX = "starter/";
const STARTER_EXCLUDED_FILES = new Set([
  "starter/sample.input",
  "starter/tests.json",
]);

export function getStarterFiles(entries: ReaderEntry[]): ReaderEntry[] {
  return entries
    .filter(
      (entry) =>
        entry.kind === "file" &&
        entry.path.startsWith(STARTER_PREFIX) &&
        !STARTER_EXCLUDED_FILES.has(entry.path) &&
        entry.content,
    )
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function hasProjectStarter(entries: ReaderEntry[]): boolean {
  return entries.some(
    (entry) => entry.kind === "file" && entry.path === "starter/index.js" && entry.content,
  );
}

function starterFileSeparator(path: string): string {
  return `// --- ${path} ---`;
}

/** Builds plain-text delivery content from project starter/ code files (no markdown fences). */
export function buildStarterDeliveryContent(entries: ReaderEntry[]): string | null {
  const files = getStarterFiles(entries);
  if (files.length === 0) return null;

  if (files.length === 1) {
    return files[0]!.content!.trimEnd();
  }

  return files
    .map((file) => `${starterFileSeparator(file.path)}\n\n${file.content!.trimEnd()}`)
    .join("\n\n");
}

/** Appends starter code to an existing delivery draft, or returns starter-only content. */
export function appendStarterToDraft(currentDraft: string, entries: ReaderEntry[]): string {
  const starter = buildStarterDeliveryContent(entries);
  if (!starter) return currentDraft;

  const trimmed = currentDraft.trim();
  if (!trimmed) return starter;

  return `${trimmed}\n\n---\n\n${starter}`;
}
