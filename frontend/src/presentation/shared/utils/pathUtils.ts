export function parentPath(p: string): string {
  if (!p) return "";
  const parts = p.split("/").filter(Boolean);
  parts.pop();
  return parts.join("/");
}

export function basename(p: string): string {
  if (!p) return "";
  const parts = p.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? p;
}

export function humanPathSegments(cwd: string): string[] {
  if (!cwd) return ["Root"];
  return cwd.split("/").filter(Boolean);
}

export function cwdBreadcrumb(cwd: string): { label: string; path: string }[] {
  const segments: { label: string; path: string }[] = [{ label: "Project root", path: "" }];
  if (!cwd) return segments;

  const parts = cwd.split("/").filter(Boolean);
  let acc = "";
  for (const part of parts) {
    acc = acc ? `${acc}/${part}` : part;
    segments.push({ label: part, path: acc });
  }
  return segments;
}

export function lessonIdFromRootPath(rootPath: string): string | undefined {
  const parts = rootPath.split("/").filter(Boolean);
  const lessonsIdx = parts.indexOf("lessons");
  if (lessonsIdx < 0 || lessonsIdx >= parts.length - 1) return undefined;
  return parts[lessonsIdx + 1];
}
