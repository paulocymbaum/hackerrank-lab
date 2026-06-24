import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { getModuleById, getProjectById } from "../../../application/selectors/catalogSelectors";
import { useCourse } from "../../../application/hooks/useCourse";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { loadCourseScores } from "../../../application/usecases/courseScores";
import { useEffect } from "react";
import { ErrorPanel, LoadingState } from "../../design-system";
import { ActivityScreenLayout } from "../../shared/ActivityScreenLayout";
import { ProjectWorkspacePanel } from "../lesson-workspace/components/ProjectWorkspacePanel";

export function ProjectActivityRoute() {
  const { courseId = "", moduleId = "", lessonId = "", projectId = "" } = useParams();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { course, status, error, load, reload } = useCourse(courseId);
  const { goLesson, parseProjectTab, setProjectTab } = useAppNavigation();
  const projectTab = parseProjectTab(searchParams.get("tab"));

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  useEffect(() => {
    if (!courseId || status !== "ready") return;
    void loadCourseScores(courseId);
  }, [courseId, status]);

  if (status === "loading" || status === "idle") {
    return <LoadingState message={t("project.loading")} />;
  }

  if (status === "error") {
    return (
      <ErrorPanel
        title={t("error.loadCourse")}
        message={error ?? undefined}
        onRetry={() => void reload()}
      />
    );
  }

  if (!course) {
    return <ErrorPanel title={t("error.courseNotFound")} />;
  }

  const mod = getModuleById(course, moduleId);
  const project = getProjectById(course, moduleId, projectId);
  if (!mod || !project) {
    return <ErrorPanel title={t("error.projectNotFound")} />;
  }

  return (
    <ActivityScreenLayout
      title={project.title}
      backLabel={t("project.backToLesson")}
      onBack={() => goLesson(courseId, moduleId, lessonId)}
    >
      <ProjectWorkspacePanel
        courseId={courseId}
        courseTitle={course.title}
        project={project}
        drawerTab={projectTab}
        onDrawerTabChange={setProjectTab}
      />
    </ActivityScreenLayout>
  );
}
