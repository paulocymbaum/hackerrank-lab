import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  getLessonById,
  getModuleById,
  getProjectsForLesson,
  getQuizzesForLesson,
} from "../../../application/selectors/catalogSelectors";
import { getQuizById } from "../../../application/selectors/quizSelectors";
import { useCourse } from "../../../application/hooks/useCourse";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useQuizSessionStore } from "../../../application/stores/quizSessionStore";
import { loadCourseScores } from "../../../application/usecases/courseScores";
import { Drawer, ErrorPanel, LoadingState } from "../../design-system";
import {
  LessonActivitiesPanel,
  LessonProgressHeader,
} from "./components/LessonActivitiesPanel";
import { LessonExplanationPanel } from "./components/LessonExplanationPanel";
import { ProjectWorkspacePanel } from "./components/ProjectWorkspacePanel";
import { QuizDrawerPanel } from "./components/QuizDrawerPanel";

export function LessonWorkspaceRoute() {
  const { courseId = "", moduleId = "", lessonId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { course, status, error, load, reload } = useCourse(courseId);
  const {
    openLessonDrawer,
    closeLessonDrawer,
    setLessonDrawerTab,
    parseDrawerMode,
    parseDrawerTab,
  } = useAppNavigation();

  const drawerMode = parseDrawerMode(searchParams.get("drawer"));
  const drawerTab = parseDrawerTab(searchParams.get("drawerTab"));
  const activeQuizId = searchParams.get("quiz");
  const activeProjectId = searchParams.get("project");

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  useEffect(() => {
    if (!courseId || status !== "ready") return;
    void loadCourseScores(courseId);
  }, [courseId, status]);

  useEffect(() => {
    if (drawerMode !== "quiz" || !activeQuizId) return;
    const session = useQuizSessionStore.getState();
    if (session.quizId !== activeQuizId) session.start(activeQuizId);
  }, [drawerMode, activeQuizId]);

  if (status === "loading" || status === "idle") {
    return <LoadingState message="Loading lesson…" />;
  }

  if (status === "error") {
    return (
      <ErrorPanel
        title="Failed to load course."
        message={error ?? undefined}
        onRetry={() => void reload()}
      />
    );
  }

  if (!course) {
    return <ErrorPanel title="Course not found." />;
  }

  const mod = getModuleById(course, moduleId);
  const lesson = getLessonById(course, moduleId, lessonId);
  if (!mod || !lesson) {
    return <ErrorPanel title="Lesson not found." />;
  }

  const lessonQuizzes = getQuizzesForLesson(course, moduleId, lessonId);
  const lessonProjects = getProjectsForLesson(course, moduleId, lessonId);
  const hasActivities = lessonQuizzes.length > 0 || lessonProjects.length > 0;

  const activeQuiz = activeQuizId ? getQuizById(course, activeQuizId) : null;
  const activeProject = activeProjectId
    ? lessonProjects.find((p) => p.id === activeProjectId) ?? null
    : null;

  const drawerOpen = drawerMode === "quiz" || drawerMode === "project";
  const drawerTitle =
    drawerMode === "quiz"
      ? (activeQuiz?.title ?? "Quiz")
      : drawerMode === "project"
        ? (activeProject?.title ?? "Project")
        : undefined;

  const openQuiz = (quizId: string) =>
    openLessonDrawer(courseId, moduleId, lessonId, "quiz", quizId);
  const openProject = (projectId: string) =>
    openLessonDrawer(courseId, moduleId, lessonId, "project", projectId, "files");

  const activityPanelProps = {
    courseId,
    lessonId,
    quizzes: lessonQuizzes,
    projects: lessonProjects,
    activeQuizId,
    activeProjectId,
    onOpenQuiz: openQuiz,
    onOpenProject: openProject,
  };

  return (
    <section className="flex min-h-[70vh] flex-col gap-0 overflow-hidden rounded-panel border border-border0 lg:flex-row">
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <LessonProgressHeader
          courseId={courseId}
          lessonId={lessonId}
          quizzes={lessonQuizzes}
          projects={lessonProjects}
        />

        {hasActivities ? (
          <div className="border-b border-border0 lg:hidden">
            <LessonActivitiesPanel {...activityPanelProps} />
          </div>
        ) : null}

        <LessonExplanationPanel title={lesson.title} markdown={lesson.markdown} showTitle={false} />
      </main>

      {hasActivities ? (
        <div className="hidden min-h-0 w-full max-w-sm border-t border-border0 lg:flex lg:w-80 lg:border-l lg:border-t-0">
          <LessonActivitiesPanel {...activityPanelProps} className="w-full" />
        </div>
      ) : null}

      <Drawer
        open={drawerOpen}
        onClose={() => closeLessonDrawer(courseId, moduleId, lessonId)}
        title={drawerTitle}
      >
        {drawerMode === "quiz" && activeQuiz ? (
          <QuizDrawerPanel
            courseId={courseId}
            course={course}
            quiz={activeQuiz}
            onClose={() => closeLessonDrawer(courseId, moduleId, lessonId)}
          />
        ) : null}
        {drawerMode === "project" && activeProject ? (
          <ProjectWorkspacePanel
            courseId={courseId}
            courseTitle={course.title}
            project={activeProject}
            drawerTab={drawerTab}
            onDrawerTabChange={setLessonDrawerTab}
            embedded
          />
        ) : null}
      </Drawer>
    </section>
  );
}
