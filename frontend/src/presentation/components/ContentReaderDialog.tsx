import { useEffect } from "react";
import { useContentReaderStore } from "../../application/stores/contentReaderStore";
import { Card } from "../design-system/components/Card";
import { Button } from "../design-system/components/Button";
import { MarkdownView } from "./MarkdownView";
import { Icon } from "../design-system/icons/Icon";
import { BookOpenText, FileText, FolderTree } from "lucide-react";

function parentPath(p: string) {
  if (!p) return "";
  const parts = p.split("/").filter(Boolean);
  parts.pop();
  return parts.join("/");
}

function basename(p: string) {
  if (!p) return "";
  const parts = p.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? p;
}

export function ContentReaderDialog() {
  const isOpen = useContentReaderStore((s) => s.isOpen);
  const item = useContentReaderStore((s) => s.item);
  const close = useContentReaderStore((s) => s.close);
  const tab = useContentReaderStore((s) => s.tab);
  const setTab = useContentReaderStore((s) => s.setTab);
  const cwd = useContentReaderStore((s) => s.cwd);
  const setCwd = useContentReaderStore((s) => s.setCwd);
  const selectedFilePath = useContentReaderStore((s) => s.selectedFilePath);
  const selectFile = useContentReaderStore((s) => s.selectFile);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  if (!isOpen || !item) return null;

  const entries = item.entries ?? [];

  const currentDirEntry =
    entries.find((e) => e.kind === "dir" && e.path === cwd) ?? null;
  const explanationMarkdown =
    item.kind === "lesson"
      ? item.markdown
      : currentDirEntry?.readmeMarkdown?.trim()
        ? currentDirEntry.readmeMarkdown
        : item.markdown;

  const children = entries
    .filter((e) => e.path !== cwd && parentPath(e.path) === cwd)
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
      return a.path.localeCompare(b.path);
    });

  const filesInCwd = children.filter((c) => c.kind === "file");
  const selected =
    (selectedFilePath
      ? entries.find((e) => e.kind === "file" && e.path === selectedFilePath)
      : null) ??
    (filesInCwd[0] ?? null);

  const selectedContent = selected?.content ?? "";
  const selectedIsMarkdown = selected?.path.toLowerCase().endsWith(".md") ?? false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close reader"
        onClick={close}
      />

      <Card
        variant="panel"
        className="relative w-full max-w-[980px] overflow-hidden p-0 shadow-glass2"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border0 bg-glassFillStrong p-4">
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-text0">{item.title}</div>
            <div className="mt-1 truncate text-[12px] text-text1">
              {item.kind === "project" ? `${item.rootPath ?? ""}${cwd ? `/${cwd}` : ""}` : item.path}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTab("folders")}
              aria-label="Folders"
              title="Folders"
            >
              <Icon icon={FolderTree} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTab("explanation")}
              aria-label="Explanation"
              title="Explanation (README)"
            >
              <Icon icon={BookOpenText} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTab("files")}
              aria-label="Files"
              title="Files"
            >
              <Icon icon={FileText} />
            </Button>
            <Button variant="ghost" size="sm" onClick={close} title="Close">
              Close
            </Button>
          </div>
        </div>

        {tab === "explanation" ? (
          <div className="max-h-[70vh] overflow-auto p-4">
            <MarkdownView markdown={explanationMarkdown} />
          </div>
        ) : null}

        {tab === "folders" ? (
          <div className="max-h-[70vh] overflow-auto p-4">
            {item.kind === "lesson" ? (
              <div className="text-[13px] text-text1">
                Lessons don’t have nested folders in this static catalog.
              </div>
            ) : (
              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[12px] font-semibold text-text1">Browse</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCwd(parentPath(cwd))}
                    disabled={!cwd}
                    title="Go up"
                  >
                    Up
                  </Button>
                </div>

                {children.length === 0 ? (
                  <p className="m-0 text-[13px] text-text1">Empty folder.</p>
                ) : (
                  <ul className="m-0 grid gap-1 p-0">
                    {children.map((c) => (
                      <li key={`${c.kind}:${c.path}`} className="list-none">
                        {c.kind === "dir" ? (
                          <button
                            type="button"
                            className="flex w-full items-center justify-between gap-3 rounded-[12px] border border-border0 bg-glassFill px-3 py-2 text-left hover:brightness-[1.03]"
                            onClick={() => setCwd(c.path)}
                            title="Open folder"
                          >
                            <span className="min-w-0 truncate text-[13px] font-medium text-text0">
                              {basename(c.path) || "(root)"}
                            </span>
                            <span className="text-[12px] text-text1">Folder</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="flex w-full items-center justify-between gap-3 rounded-[12px] border border-border0 bg-glassFillStrong px-3 py-2 text-left hover:brightness-[1.03]"
                            onClick={() => selectFile(c.path)}
                            title="Open file"
                          >
                            <span className="min-w-0 truncate text-[13px] font-medium text-text0">
                              {basename(c.path)}
                            </span>
                            <span className="text-[12px] text-text1">File</span>
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ) : null}

        {tab === "files" ? (
          <div className="grid max-h-[70vh] grid-cols-1 gap-3 overflow-hidden p-4 md:grid-cols-[280px_1fr]">
            <div className="overflow-auto rounded-panel border border-border0 bg-glassFill p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-[12px] font-semibold text-text1">Files</div>
                {item.kind === "project" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCwd(parentPath(cwd))}
                    disabled={!cwd}
                    title="Go up"
                  >
                    Up
                  </Button>
                ) : null}
              </div>

              {filesInCwd.length === 0 ? (
                <p className="m-0 text-[13px] text-text1">No files in this folder.</p>
              ) : (
                <ul className="m-0 grid gap-1 p-0">
                  {filesInCwd.map((f) => {
                    const active = selected?.path === f.path;
                    return (
                      <li key={f.path} className="list-none">
                        <button
                          type="button"
                          className={[
                            "w-full truncate rounded-[10px] border px-2 py-1 text-left text-[12px] font-medium",
                            active
                              ? "border-accent0/50 bg-glassFillStrong text-text0"
                              : "border-border0 bg-transparent text-text1 hover:bg-glassFill",
                          ].join(" ")}
                          onClick={() => selectFile(f.path)}
                          title={f.path}
                        >
                          {basename(f.path)}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="overflow-auto rounded-panel border border-border0 bg-glassFillStrong p-3">
              {!selected ? (
                <p className="m-0 text-[13px] text-text1">Pick a file.</p>
              ) : selectedIsMarkdown ? (
                <MarkdownView markdown={selectedContent} />
              ) : selectedContent.trim() ? (
                <pre className="m-0 whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-text0">
                  {selectedContent}
                </pre>
              ) : (
                <p className="m-0 text-[13px] text-text1">
                  This file is binary, empty, or too large to embed.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

