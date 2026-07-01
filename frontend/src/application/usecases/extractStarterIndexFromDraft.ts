const STARTER_HEADING_BLOCK =
  /###\s+`starter\/index\.js`[\s\S]*?```(?:[\w-]+)?\n([\s\S]*?)```/;

const STARTER_INDEX_SECTION =
  /\/\/ --- starter\/index\.js ---\s*\n+([\s\S]*?)(?=\n\/\/ --- starter\/|\Z)/;

const CODE_FENCE = /```(?:javascript|js|typescript|ts)?\n([\s\S]*?)```/g;

function looksLikeSourceCode(text: string): boolean {
  const indicators = [
    /^\s*(const|let|var|function|class|import|export|require)\b/m,
    /^\s*\/\*\*/m,
    /^\s*\/\//m,
    /=>\s*[{(]/m,
    /\bmodule\.exports\b/,
    /\bprocess\.(stdin|stdout)\b/,
    /\breadline\b/,
  ];
  return indicators.some((pattern) => pattern.test(text));
}

function lastCodeFence(draft: string): string | null {
  const matches = [...draft.matchAll(CODE_FENCE)];
  const last = matches.at(-1)?.[1]?.trim();
  return last || null;
}

/** Pulls runnable source from the delivery draft when present. */
export function extractStarterIndexFromDraft(draft: string): string | null {
  const trimmed = draft.trim();
  if (!trimmed) return null;

  const headingMatch = trimmed.match(STARTER_HEADING_BLOCK);
  if (headingMatch?.[1]?.trim()) return headingMatch[1].trim();

  const indexSection = trimmed.match(STARTER_INDEX_SECTION);
  if (indexSection?.[1]?.trim()) return indexSection[1].trim();

  const fenced = lastCodeFence(trimmed);
  if (fenced) return fenced;

  if (looksLikeSourceCode(trimmed)) return trimmed;

  return null;
}

/** Code to execute: draft answer first, otherwise fall back to starter/index.js on disk. */
export function resolveRunCodeFromDraft(draft: string): string | undefined {
  return extractStarterIndexFromDraft(draft) ?? undefined;
}

export function canRunProjectDraft(draft: string, hasStarterOnDisk: boolean): boolean {
  if (extractStarterIndexFromDraft(draft)) return true;
  return hasStarterOnDisk;
}
