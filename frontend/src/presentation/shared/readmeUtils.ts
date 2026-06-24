/** Remove leading # title when it matches the page title (breadcrumb already shows it). */
export function stripDuplicateReadmeTitle(markdown: string, title: string): string {
  const trimmed = markdown.trimStart();
  const match = trimmed.match(/^#\s+(.+?)(?:\r?\n|$)/);
  if (!match) return markdown;

  const heading = match[1]?.trim() ?? "";
  if (heading.localeCompare(title.trim(), undefined, { sensitivity: "accent" }) !== 0) {
    return markdown;
  }

  return trimmed.slice(match[0].length).trimStart();
}

const PLACEHOLDER_SECTIONS = /##\s+(Overview|Modules|How to study)\s*\n/gi;

/** True when readme is only scaffold headings with no body text. */
export function isPlaceholderReadme(markdown: string): boolean {
  const body = markdown
    .trim()
    .replace(/^#\s+[^\n]+\n?/, "")
    .replace(PLACEHOLDER_SECTIONS, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();

  return body.length < 40;
}

export function hasDisplayableReadme(markdown: string, title?: string): boolean {
  const normalized = title ? stripDuplicateReadmeTitle(markdown, title) : markdown.trim();
  if (!normalized.trim()) return false;
  return !isPlaceholderReadme(normalized);
}
