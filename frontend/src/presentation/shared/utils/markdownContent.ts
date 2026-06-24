/** True when markdown has body text beyond headings, comments, and dividers. */
export function hasSubstantiveMarkdown(markdown: string | undefined): boolean {
  if (!markdown?.trim()) return false;

  const stripped = markdown
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/^>+\s?.*$/gm, "")
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  return stripped.length > 0;
}
