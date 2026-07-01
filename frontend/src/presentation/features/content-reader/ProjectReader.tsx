import { useEffect, useMemo, useState } from "react";
import type { Project } from "../../../domain/types/catalog";
import type { DrawerTab } from "../../../domain/types/navigation";
import type { ReaderEntry, ReaderTab } from "../../../domain/types/reader";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { useProjectProgressStore } from "../../../application/stores/projectProgressStore";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { Tabs } from "../../design-system";
import { FolderBrowser } from "./components/FolderBrowser";
import { ProjectDeliveryPanel } from "./components/ProjectDeliveryPanel";
import { ProjectStatusBadge } from "../course-experience/components/ProjectStatusBadge";

export type ProjectReaderLayout = "overlay" | "drawer";

function getExplanationMarkdown(project: Project, entries: ReaderEntry[], cwd: string): string {
  const currentDir = entries.find((e) => e.kind === "dir" && e.path === cwd);
  if (currentDir?.readmeMarkdown?.trim()) return currentDir.readmeMarkdown;
  return project.readmeMarkdown;
}

function resolveDrawerTab(tab: DrawerTab, embedded: boolean, hasContext: boolean): DrawerTab {
  if (embedded && tab === "explanation") return "delivery";
  if (tab === "context" && !hasContext) return "delivery";
  return tab;
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
  const { t } = useTranslation();
  const {
    layout,
    courseId,
    courseTitle,
    project,
    drawerTab = "delivery",
    onDrawerTabChange,
    overlayTab = "explanation",
    overlayCwd: externalCwd,
    onOverlayCwdChange,
    onOverlaySelectFile,
    embedded = layout === "drawer",
  } = props;

  const entries = project.entries;
  const [internalCwd, setInternalCwd] = useState("");
  const [internalSelectedFile, setInternalSelectedFile] = useState<string | null>(null);

  const cwd = externalCwd ?? internalCwd;
  const setCwd = onOverlayCwdChange ?? setInternalCwd;
  const setSelectedFilePath = onOverlaySelectFile ?? setInternalSelectedFile;

  const getProjectStatus = useProjectProgressStore((s) => s.getStatus);
  const markProjectDoing = useProjectProgressStore((s) => s.markProjectDoing);

  const explanationMarkdown = getExplanationMarkdown(project, entries, cwd);
  const hasContext = Boolean(explanationMarkdown.trim());
  const activeDrawerTab = resolveDrawerTab(drawerTab, embedded, hasContext);

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

  const showContextOverlay = overlayTab === "context" || overlayTab === "explanation";

  if (layout === "overlay") {
    return (
      <>
        {showContextOverlay ? (
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

        {overlayTab === "delivery" ? (
          <ProjectDeliveryPanel
            courseId={courseId}
            courseTitle={courseTitle}
            projectTitle={project.title}
            projectId={project.id}
            rootPath={project.rootPath}
            entries={entries}
            enabled={overlayTab === "delivery"}
          />
        ) : null}
      </>
    );
  }

  const tabItems = useMemo(() => {
    const items: { value: DrawerTab; label: string }[] = [];

    if (embedded) {
      if (hasContext) items.push({ value: "context", label: t("tabs.context") });
      items.push({ value: "delivery", label: t("tabs.delivery") });
      return items;
    }

    if (hasContext) items.push({ value: "context", label: t("tabs.context") });
    else items.push({ value: "explanation", label: t("tabs.brief") });
    items.push({ value: "delivery", label: t("tabs.delivery") });
    return items;
  }, [embedded, hasContext, t]);

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

      {activeDrawerTab === "explanation" ? (
        <div className="overflow-auto p-4">
          <ReadmePanel markdown={explanationMarkdown} variant="inline" />
        </div>
      ) : null}

      {activeDrawerTab === "context" ? (
        <div className="overflow-auto p-4">
          <ReadmePanel markdown={explanationMarkdown} variant="inline" />
        </div>
      ) : null}

      {activeDrawerTab === "delivery" ? (
        <ProjectDeliveryPanel
          courseId={courseId}
          courseTitle={courseTitle}
          projectTitle={project.title}
          projectId={project.id}
          rootPath={project.rootPath}
          entries={entries}
          enabled={activeDrawerTab === "delivery"}
        />
      ) : null}
    </div>
  );
}
