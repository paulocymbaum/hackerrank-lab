import { useMemo } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../../../domain/types/catalog";
import type { ReaderItem } from "../../../domain/types/reader";
import { useContentReader } from "../../../application/hooks/useContentReader";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useCourse } from "../../../application/hooks/useCourse";
import { useProjectProgressStore } from "../../../application/stores/projectProgressStore";
import { humanPathSegments } from "../../shared/utils/pathUtils";
import { Dialog, Button } from "../../design-system";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { ProjectReader } from "../content-reader/ProjectReader";
import { ReaderHeader } from "../content-reader/components/ReaderHeader";
import { ReaderTabBar } from "../content-reader/components/ReaderTabBar";
import { ProjectStatusBadge } from "../course-experience/components/ProjectStatusBadge";

export function ContentReaderDialog() {
  const { courseId = "" } = useParams();
  const { course } = useCourse(courseId);
  const { isOpen, item, tab, cwd, selectedFilePath, close, setTab, setCwd, selectFile } =
    useContentReader();
  const { closeReader, setReaderTab } = useAppNavigation();
  const getProjectStatus = useProjectProgressStore((s) => s.getStatus);

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

  const showFolders = item.kind === "project";
  const showDelivery = item.kind === "project";

  const projectFromItem = (readerItem: ReaderItem): Project | null => {
    if (readerItem.kind !== "project" || !readerItem.projectId) return null;
    return {
      id: readerItem.projectId,
      title: readerItem.title,
      readmeMarkdown: readerItem.markdown,
      readmePath: readerItem.path,
      rootPath: readerItem.rootPath ?? "",
      entries: readerItem.entries ?? [],
      lessonId: readerItem.lessonId,
    };
  };

  const project = projectFromItem(item);

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
              showDelivery={showDelivery}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {item.kind === "project" && item.projectId ? (
                <ProjectStatusBadge
                  value={getProjectStatus(courseId, item.projectId, item.lessonId)}
                  showPoints
                  size="md"
                />
              ) : null}
              <Button variant="ghost" size="md" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        </>
      }
    >
      {item.kind === "lesson" && tab === "explanation" ? (
        <div style={{ maxHeight: "70vh" }}>
          <ReadmePanel title={item.title} markdown={item.markdown} variant="scroll" />
        </div>
      ) : null}

      {item.kind === "project" && project ? (
        <ProjectReader
          layout="overlay"
          courseId={courseId}
          courseTitle={course?.title ?? ""}
          project={project}
          overlayTab={tab}
          overlayCwd={cwd}
          onOverlayCwdChange={setCwd}
          overlaySelectedFile={selectedFilePath}
          onOverlaySelectFile={selectFile}
        />
      ) : null}
    </Dialog>
  );
}
