import type { ReaderEntry } from "../../../../domain/types/reader";
import { basename, parentPath } from "../../../shared/utils/pathUtils";
import { Button } from "../../../design-system";

export function FolderBrowser(props: {
  entries: ReaderEntry[];
  cwd: string;
  onCwdChange: (cwd: string) => void;
  onSelectFile: (path: string) => void;
}) {
  const children = props.entries
    .filter((e) => e.path !== props.cwd && parentPath(e.path) === props.cwd)
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
      return a.path.localeCompare(b.path);
    });

  return (
    <div className="grid gap-3 overflow-auto p-4" style={{ maxHeight: "70vh" }}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-meta font-semibold text-text1">Browse</div>
        <Button
          size="md"
          variant="ghost"
          onClick={() => props.onCwdChange(parentPath(props.cwd))}
          disabled={!props.cwd}
          title="Go up"
        >
          Up
        </Button>
      </div>

      {children.length === 0 ? (
        <p className="m-0 text-body text-text1">Empty folder.</p>
      ) : (
        <ul className="m-0 grid gap-1 p-0">
          {children.map((entry) => (
            <li key={`${entry.kind}:${entry.path}`} className="list-none">
              {entry.kind === "dir" ? (
                <button
                  type="button"
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-panel border border-border0 bg-surfacePanel px-3 py-2 text-left hover:brightness-[1.03]"
                  onClick={() => props.onCwdChange(entry.path)}
                  title="Open folder"
                >
                  <span className="min-w-0 truncate text-body font-medium text-text0">
                    {basename(entry.path) || "(root)"}
                  </span>
                  <span className="text-meta text-text1">Folder</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-left hover:brightness-[1.03]"
                  onClick={() => props.onSelectFile(entry.path)}
                  title="Open file"
                >
                  <span className="min-w-0 truncate text-body font-medium text-text0">
                    {basename(entry.path)}
                  </span>
                  <span className="text-meta text-text1">File</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
