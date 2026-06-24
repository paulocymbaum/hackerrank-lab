import type { ReaderEntry } from "../../domain/types/reader";

const STARTER_PREFIX = "starter/";

export function getStarterFiles(entries: ReaderEntry[]): ReaderEntry[] {
  return entries
    .filter((entry) => entry.kind === "file" && entry.path.startsWith(STARTER_PREFIX) && entry.content)
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function hasProjectStarter(entries: ReaderEntry[]): boolean {
  return getStarterFiles(entries).length > 0;
}

function fenceLanguage(path: string): string {
  const ext = path.split(".").pop() ?? "";
  const byExt: Record<string, string> = {
    js: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    ts: "typescript",
    json: "json",
    md: "markdown",
  };
  return byExt[ext] ?? ext;
}

/** Builds markdown delivery content from project starter/ files. */
export function buildStarterDeliveryContent(entries: ReaderEntry[]): string | null {
  const files = getStarterFiles(entries);
  if (files.length === 0) return null;

  return files
    .map((file) => {
      const lang = fenceLanguage(file.path);
      return `### \`${file.path}\`\n\n\`\`\`${lang}\n${file.content!.trimEnd()}\n\`\`\``;
    })
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
