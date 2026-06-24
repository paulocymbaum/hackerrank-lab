import { useEffect } from "react";
import type { Project } from "../../../../domain/types/catalog";
import type { DrawerTab } from "../../../../domain/types/navigation";
import type { ReaderEntry } from "../../../../domain/types/reader";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Tabs } from "../../../design-system";
import { MarkdownView } from "../../../shared/MarkdownView";
import { ProjectFileExplorer } from "../../content-reader/components/ProjectFileExplorer";
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
  const { t } = useTranslation();
  const { project, courseId, courseTitle, drawerTab, onDrawerTabChange, embedded } = props;
  const entries = project.entries;

  const getProjectStatus = useProjectProgressStore((s) => s.getStatus);
  const markProjectDoing = useProjectProgressStore((s) => s.markProjectDoing);

  useEffect(() => {
    if (drawerTab !== "delivery") return;
    markProjectDoing(courseId, project.id, project.lessonId);
  }, [drawerTab, courseId, project.id, project.lessonId, markProjectDoing]);

  const tabItems = embedded
    ? [
        { value: "files", label: t("tabs.files") },
        { value: "delivery", label: t("tabs.delivery") },
      ]
    : [
        { value: "explanation", label: t("tabs.brief") },
        { value: "files", label: t("tabs.files") },
        { value: "delivery", label: t("tabs.delivery") },
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
          <MarkdownView markdown={getExplanationMarkdown(project, entries, "")} />
        </div>
      ) : null}

      {activeTab === "files" ? <ProjectFileExplorer entries={entries} /> : null}

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
