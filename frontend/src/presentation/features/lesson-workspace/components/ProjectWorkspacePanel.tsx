import { useEffect, useMemo, useState } from "react";
import type { Project } from "../../../../domain/types/catalog";
import type { DrawerTab } from "../../../../domain/types/navigation";
import type { ReaderEntry } from "../../../../domain/types/reader";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { parentPath } from "../../../shared/utils/pathUtils";
import { Tabs } from "../../../design-system";
import { MarkdownView } from "../../../shared/MarkdownView";
import { FolderBrowser } from "../../content-reader/components/FolderBrowser";
import { FilePreview } from "../../content-reader/components/FilePreview";
import { ProjectDeliveryPanel } from "../../content-reader/components/ProjectDeliveryPanel";
import { ProjectStatusBadge } from "../../course-experience/components/ProjectStatusBadge";

function getExplanationMarkdown(project: Project, entries: ReaderEntry[], cwd: string): string {
  const currentDir = entries.find((e) => e.kind === "dir" && e.path === cwd);
  if (currentDir?.readmeMarkdown?.trim()) return currentDir.readmeMarkdown;
  return project.readmeMarkdown;
}

export function ProjectWorkspacePanel(props: {
  courseId: string;
  courseTitle: string;
  project: Project;
  drawerTab: DrawerTab;
  onDrawerTabChange: (tab: DrawerTab) => void;
  /** In lesson workspace the main pane already shows lesson context — only files + delivery. */
  embedded?: boolean;
}) {
  const { project, courseId, courseTitle, drawerTab, onDrawerTabChange, embedded } = props;
  const entries = project.entries;
  const [cwd, setCwd] = useState("");
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

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

  useEffect(() => {
    if (drawerTab !== "delivery") return;
    markProjectDoing(courseId, project.id, project.lessonId);
  }, [drawerTab, courseId, project.id, project.lessonId, markProjectDoing]);

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

  const activeTab =
    embedded && drawerTab === "explanation" ? "files" : drawerTab;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border0 px-4 py-3">
        <Tabs
          value={activeTab}
          onValueChange={(v) => onDrawerTabChange(v as DrawerTab)}
          items={tabItems}
        />
        <ProjectStatusBadge
          value={getProjectStatus(courseId, project.id, project.lessonId)}
          showPoints
          size="sm"
        />
      </div>

      {!embedded && activeTab === "explanation" ? (
        <div className="overflow-auto p-4">
          <MarkdownView markdown={explanationMarkdown} />
        </div>
      ) : null}

      {activeTab === "files" ? (
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

      {activeTab === "delivery" ? (
        <ProjectDeliveryPanel
          courseId={courseId}
          courseTitle={courseTitle}
          projectTitle={project.title}
          projectId={project.id}
          rootPath={project.rootPath}
          enabled={activeTab === "delivery"}
        />
      ) : null}
    </div>
  );
}
