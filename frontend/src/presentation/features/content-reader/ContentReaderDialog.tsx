import { useMemo } from "react";
import type { ReaderEntry, ReaderItem } from "../../../domain/types/reader";
import { useContentReader } from "../../../application/hooks/useContentReader";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { parentPath, humanPathSegments, basename } from "../../shared/utils/pathUtils";
import { Dialog, Button } from "../../design-system";
import { MarkdownView } from "../../shared/MarkdownView";
import { ReaderHeader } from "./components/ReaderHeader";
import { ReaderTabBar } from "./components/ReaderTabBar";
import { FolderBrowser } from "./components/FolderBrowser";
import { FilePreview } from "./components/FilePreview";

function getExplanationMarkdown(item: ReaderItem, entries: ReaderEntry[], cwd: string): string {
  if (item.kind === "lesson") return item.markdown;
  const currentDir = entries.find((e) => e.kind === "dir" && e.path === cwd);
  if (currentDir?.readmeMarkdown?.trim()) return currentDir.readmeMarkdown;
  return item.markdown;
}

export function ContentReaderDialog() {
  const { isOpen, item, tab, cwd, selectedFilePath, close, setTab, setCwd, selectFile } =
    useContentReader();
  const { closeReader, setReaderTab } = useAppNavigation();

  const entries = item?.entries ?? [];

  const children = useMemo(
    () =>
      entries
        .filter((e) => e.path !== cwd && parentPath(e.path) === cwd)
        .sort((a, b) => {
          if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
          return a.path.localeCompare(b.path);
        }),
    [entries, cwd],
  );

  const filesInCwd = children.filter((c) => c.kind === "file");
  const showFolders = item?.kind === "project";

  const breadcrumbSegments = useMemo(() => {
    if (!item) return [];
    return humanPathSegments(cwd).map((label) => ({ label }));
  }, [item, cwd]);

  const handleClose = () => {
    close();
    closeReader();
  };

  const handleTabChange = (next: typeof tab) => {
    setTab(next);
    setReaderTab(next);
  };

  if (!item) return null;

  const explanationMarkdown = getExplanationMarkdown(item, entries, cwd);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title={item.title}
      description={`Content reader for ${item.title}`}
      header={
        <>
          <ReaderHeader title={item.title} segments={breadcrumbSegments} />
          <div className="flex flex-col gap-3 border-b border-border0 bg-surfaceControl px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <ReaderTabBar
              value={tab}
              onValueChange={handleTabChange}
              showFolders={showFolders}
            />
            <Button variant="ghost" size="md" onClick={handleClose}>
              Close
            </Button>
          </div>
        </>
      }
    >
      {tab === "explanation" ? (
        <div className="overflow-auto p-4" style={{ maxHeight: "70vh" }}>
          <MarkdownView markdown={explanationMarkdown} />
        </div>
      ) : null}

      {tab === "folders" && showFolders ? (
        <FolderBrowser
          entries={entries}
          cwd={cwd}
          onCwdChange={setCwd}
          onSelectFile={selectFile}
        />
      ) : null}

      {tab === "files" ? (
        <FilePreview
          entries={entries}
          cwd={cwd}
          filesInCwd={filesInCwd}
          selectedFilePath={selectedFilePath}
          showUp={item.kind === "project"}
          onCwdChange={setCwd}
          onSelectFile={selectFile}
        />
      ) : null}
    </Dialog>
  );
}
