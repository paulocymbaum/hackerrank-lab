import { useMemo, useState } from "react";
import clsx from "clsx";
import { ChevronRight, File, Folder, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { ReaderEntry } from "../../../../domain/types/reader";
import { basename, cwdBreadcrumb, parentPath } from "../../../shared/utils/pathUtils";
import { Button, Icon } from "../../../design-system";
import { MarkdownView } from "../../../shared/MarkdownView";

export function ProjectFileExplorer(props: { entries: ReaderEntry[] }) {
  const [cwd, setCwd] = useState("");
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [fileListOpen, setFileListOpen] = useState(true);

  const children = useMemo(
    () =>
      props.entries
        .filter((e) => e.path !== cwd && parentPath(e.path) === cwd)
        .sort((a, b) => {
          if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
          return a.path.localeCompare(b.path);
        }),
    [props.entries, cwd],
  );

  const breadcrumb = cwdBreadcrumb(cwd);
  const selected =
    (selectedFilePath
      ? props.entries.find((e) => e.kind === "file" && e.path === selectedFilePath)
      : null) ?? null;

  const selectedContent = selected?.content ?? "";
  const selectedIsMarkdown = selected?.path.toLowerCase().endsWith(".md") ?? false;

  const navigateTo = (path: string) => {
    setCwd(path);
    setSelectedFilePath(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border0 px-3 py-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          title={fileListOpen ? "Hide file list" : "Show file list"}
          aria-label={fileListOpen ? "Hide file list" : "Show file list"}
          aria-pressed={fileListOpen}
          onClick={() => setFileListOpen((open) => !open)}
        >
          <Icon icon={fileListOpen ? PanelLeftClose : PanelLeftOpen} size={16} />
        </Button>

        <nav
          className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-meta"
          aria-label="Project folder path"
        >
          {breadcrumb.map((segment, index) => (
            <span key={segment.path || "root"} className="flex min-w-0 items-center gap-1">
              {index > 0 ? <Icon icon={ChevronRight} size={14} className="shrink-0 text-text2" /> : null}
              <button
                type="button"
                className={clsx(
                  "truncate rounded-panel px-1.5 py-0.5 hover:bg-surfacePanel",
                  segment.path === cwd ? "font-semibold text-text0" : "text-text1",
                )}
                onClick={() => navigateTo(segment.path)}
                title={segment.path || "Project root"}
              >
                {segment.label}
              </button>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {fileListOpen ? (
          <aside className="flex w-56 shrink-0 flex-col overflow-hidden border-r border-border0 bg-surfacePanel">
            <div className="shrink-0 border-b border-border0 px-3 py-2 text-meta font-semibold text-text1">
              Files
            </div>
            <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-2">
              {children.length === 0 ? (
                <li className="px-2 py-1 text-meta text-text1">Empty folder.</li>
              ) : (
                children.map((entry) => {
                  const name = basename(entry.path) || entry.path;
                  const isDir = entry.kind === "dir";
                  const active = !isDir && selected?.path === entry.path;
                  return (
                    <li key={`${entry.kind}:${entry.path}`}>
                      <button
                        type="button"
                        className={clsx(
                          "mb-0.5 flex min-h-9 w-full items-center gap-2 rounded-panel px-2 py-1.5 text-left text-meta",
                          active
                            ? "bg-surfaceControl font-medium text-text0"
                            : "text-text1 hover:bg-surfaceControl/60",
                        )}
                        title={isDir ? `Open folder ${name}` : `Preview ${name}`}
                        onClick={() => {
                          if (isDir) navigateTo(entry.path);
                          else setSelectedFilePath(entry.path);
                        }}
                      >
                        <Icon
                          icon={isDir ? Folder : File}
                          size={15}
                          className={isDir ? "text-accent0" : "text-text2"}
                        />
                        <span className="min-w-0 truncate">{name}</span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </aside>
        ) : null}

        <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-surfaceControl p-4">
          {!selected ? (
            <p className="m-0 text-body text-text1">
              {fileListOpen
                ? "Select a file to preview its contents."
                : "Open the file list or use the breadcrumb to browse folders."}
            </p>
          ) : selectedIsMarkdown ? (
            <MarkdownView markdown={selectedContent} />
          ) : selectedContent.trim() ? (
            <pre className="m-0 whitespace-pre-wrap font-mono text-meta leading-relaxed text-text0">
              {selectedContent}
            </pre>
          ) : (
            <p className="m-0 text-body text-text1">
              This file is binary, empty, or too large to embed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
