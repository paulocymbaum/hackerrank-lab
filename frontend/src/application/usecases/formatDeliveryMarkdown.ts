const FENCED_CODE_BLOCK = /```[\s\S]*?```/;

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

function inferFenceLanguage(text: string): string {
  if (/\brequire\s*\(/.test(text) || /\bmodule\.exports\b/.test(text)) {
    return "javascript";
  }
  if (/^\s*import\s.+from\s+['"]/m.test(text)) {
    return "typescript";
  }
  return "javascript";
}

/** Ensures delivery history renders code blocks when students paste raw source. */
export function formatDeliveryMarkdownForDisplay(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return trimmed;
  if (FENCED_CODE_BLOCK.test(trimmed)) return trimmed;
  if (/^#{1,6}\s/m.test(trimmed)) return trimmed;
  if (!looksLikeSourceCode(trimmed)) return trimmed;

  const lang = inferFenceLanguage(trimmed);
  return `\`\`\`${lang}\n${trimmed}\n\`\`\``;
}
