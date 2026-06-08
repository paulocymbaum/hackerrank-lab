import type { ReaderEntry } from "../../../../domain/types/reader";
import { basename, parentPath } from "../../../shared/utils/pathUtils";
import { MarkdownView } from "../../../shared/MarkdownView";
import { Button } from "../../../design-system";
import clsx from "clsx";

export function FilePreview(props: {
  entries: ReaderEntry[];
  cwd: string;
  filesInCwd: ReaderEntry[];
  selectedFilePath: string | null;
  showUp: boolean;
  onCwdChange: (cwd: string) => void;
  onSelectFile: (path: string) => void;
}) {
  const selected =
    (props.selectedFilePath
      ? props.entries.find((e) => e.kind === "file" && e.path === props.selectedFilePath)
      : null) ?? null;

  const selectedContent = selected?.content ?? "";
  const selectedIsMarkdown = selected?.path.toLowerCase().endsWith(".md") ?? false;

  return (
    <div
      className="grid max-h-[70vh] grid-cols-1 gap-3 overflow-hidden p-4 md:grid-cols-[280px_1fr]"
    >
      <div className="overflow-auto rounded-panel border border-border0 bg-surfacePanel p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-meta font-semibold text-text1">Files</div>
          {props.showUp ? (
            <Button
              size="md"
              variant="ghost"
              onClick={() => props.onCwdChange(parentPath(props.cwd))}
              disabled={!props.cwd}
              title="Go up"
            >
              Up
            </Button>
          ) : null}
        </div>

        {props.filesInCwd.length === 0 ? (
          <p className="m-0 text-body text-text1">No files in this folder.</p>
        ) : (
          <ul className="m-0 grid gap-1 p-0">
            {props.filesInCwd.map((file) => {
              const active = selected?.path === file.path;
              return (
                <li key={file.path} className="list-none">
                  <button
                    type="button"
                    className={clsx(
                      "min-h-11 w-full truncate rounded-panel border px-2 py-1 text-left text-meta font-medium",
                      active
                        ? "border-accent0/50 bg-surfaceControl text-text0"
                        : "border-border0 bg-transparent text-text1 hover:bg-surfacePanel",
                    )}
                    onClick={() => props.onSelectFile(file.path)}
                    title={basename(file.path)}
                  >
                    {basename(file.path)}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="overflow-auto rounded-panel border border-border0 bg-surfaceControl p-3">
        {!selected ? (
          <p className="m-0 text-body text-text1">Pick a file to preview.</p>
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
  );
}
