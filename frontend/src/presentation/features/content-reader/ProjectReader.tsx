import { useEffect, useMemo, useState } from "react";
import type { Project } from "../../../domain/types/catalog";
import type { DrawerTab } from "../../../domain/types/navigation";
import type { ReaderEntry, ReaderTab } from "../../../domain/types/reader";
import { useProjectProgressStore } from "../../../application/stores/projectProgressStore";
import { parentPath } from "../../shared/utils/pathUtils";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { Tabs } from "../../design-system";
import { FolderBrowser } from "./components/FolderBrowser";
import { FilePreview } from "./components/FilePreview";
import { ProjectDeliveryPanel } from "./components/ProjectDeliveryPanel";
import { ProjectStatusBadge } from "../course-experience/components/ProjectStatusBadge";

export type ProjectReaderLayout = "overlay" | "drawer";

function getExplanationMarkdown(project: Project, entries: ReaderEntry[], cwd: string): string {
  const currentDir = entries.find((e) => e.kind === "dir" && e.path === cwd);
  if (currentDir?.readmeMarkdown?.trim()) return currentDir.readmeMarkdown;
  return project.readmeMarkdown;
}

export function ProjectReader(props: {
  layout: ProjectReaderLayout;
  courseId: string;
  courseTitle: string;
  project: Project;
  drawerTab?: DrawerTab;
  onDrawerTabChange?: (tab: DrawerTab) => void;
  overlayTab?: ReaderTab;
  onOverlayTabChange?: (tab: ReaderTab) => void;
  overlayCwd?: string;
  onOverlayCwdChange?: (cwd: string) => void;
  overlaySelectedFile?: string | null;
  onOverlaySelectFile?: (path: string) => void;
  embedded?: boolean;
}) {
  const {
    layout,
    courseId,
    courseTitle,
    project,
    drawerTab = "files",
    onDrawerTabChange,
    overlayTab = "explanation",
    overlayCwd: externalCwd,
    onOverlayCwdChange,
    overlaySelectedFile,
    onOverlaySelectFile,
    embedded = layout === "drawer",
  } = props;

  const entries = project.entries;
  const [internalCwd, setInternalCwd] = useState("");
  const [internalSelectedFile, setInternalSelectedFile] = useState<string | null>(null);

  const cwd = externalCwd ?? internalCwd;
  const setCwd = onOverlayCwdChange ?? setInternalCwd;
  const selectedFilePath = overlaySelectedFile ?? internalSelectedFile;
  const setSelectedFilePath = onOverlaySelectFile ?? setInternalSelectedFile;

  const getProjectStatus = useProjectProgressStore((s) => s.getStatus);
  const markProjectDoing = useProjectProgressStore((s) => s.markProjectDoing);

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
  const explanationMarkdown = getExplanationMarkdown(project, entries, cwd);

  const activeDrawerTab = embedded && drawerTab === "explanation" ? "files" : drawerTab;

  useEffect(() => {
    const onDelivery =
      layout === "drawer" ? activeDrawerTab === "delivery" : overlayTab === "delivery";
    if (!onDelivery) return;
    markProjectDoing(courseId, project.id, project.lessonId);
  }, [
    layout,
    activeDrawerTab,
    overlayTab,
    courseId,
    project.id,
    project.lessonId,
    markProjectDoing,
  ]);

  if (layout === "overlay") {
    return (
      <>
        {overlayTab === "explanation" ? (
          <div style={{ maxHeight: "70vh" }}>
            <ReadmePanel title={project.title} markdown={explanationMarkdown} variant="scroll" />
          </div>
        ) : null}

        {overlayTab === "folders" ? (
          <FolderBrowser
            entries={entries}
            cwd={cwd}
            onCwdChange={setCwd}
            onSelectFile={setSelectedFilePath}
          />
        ) : null}

        {overlayTab === "files" ? (
          <FilePreview
            entries={entries}
            cwd={cwd}
            filesInCwd={filesInCwd}
            selectedFilePath={selectedFilePath}
            showUp
            onCwdChange={setCwd}
            onSelectFile={setSelectedFilePath}
          />
        ) : null}

        {overlayTab === "delivery" ? (
          <ProjectDeliveryPanel
            courseId={courseId}
            courseTitle={courseTitle}
            projectTitle={project.title}
            projectId={project.id}
            rootPath={project.rootPath}
            enabled={overlayTab === "delivery"}
          />
        ) : null}
      </>
    );
  }

  const tabItems = embedded
    ? [
        { value: "files", label: "Files" },
        { value: "delivery", label: "Delivery" },
      ]
    : [
        { value: "explanation", label: "Brief" },
        { value: "files", label: "Files" },
        { value: "delivery", label: "Delivery" },
      ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border0 px-4 py-3">
        <Tabs
          value={activeDrawerTab}
          onValueChange={(v) => onDrawerTabChange?.(v as DrawerTab)}
          items={tabItems}
        />
        <ProjectStatusBadge
          value={getProjectStatus(courseId, project.id, project.lessonId)}
          showPoints
          size="sm"
        />
      </div>

      {!embedded && activeDrawerTab === "explanation" ? (
        <div className="overflow-auto p-4">
          <ReadmePanel markdown={explanationMarkdown} variant="inline" />
        </div>
      ) : null}

      {activeDrawerTab === "files" ? (
        <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr]">
          <FolderBrowser
            entries={entries}
            cwd={cwd}
            onCwdChange={setCwd}
            onSelectFile={setSelectedFilePath}
          />
          <FilePreview
            entries={entries}
            cwd={cwd}
            filesInCwd={filesInCwd}
            selectedFilePath={selectedFilePath}
            showUp
            onCwdChange={setCwd}
            onSelectFile={setSelectedFilePath}
          />
        </div>
      ) : null}

      {activeDrawerTab === "delivery" ? (
        <ProjectDeliveryPanel
          courseId={courseId}
          courseTitle={courseTitle}
          projectTitle={project.title}
          projectId={project.id}
          rootPath={project.rootPath}
          enabled={activeDrawerTab === "delivery"}
        />
      ) : null}
    </div>
  );
}
