import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
import { Button, Drawer, ErrorPanel, Icon, LoadingState } from "../../design-system";
import { LessonExplanationPanel } from "./components/LessonExplanationPanel";
import { ProjectWorkspacePanel } from "./components/ProjectWorkspacePanel";
import { QuizDrawerPanel } from "./components/QuizDrawerPanel";

export function LessonWorkspaceRoute() {
  const { courseId = "", moduleId = "", lessonId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { course, status, error, load, reload } = useCourse(courseId);
  const {
    goModule,
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

  const activeQuiz = activeQuizId ? getQuizById(course, activeQuizId) : null;
  const activeProject =
    activeProjectId ?
      lessonProjects.find((p) => p.id === activeProjectId) ??
      course.projects.find((p) => p.id === activeProjectId) ??
      null
    : null;

  const drawerOpen = drawerMode === "quiz" || drawerMode === "project";
  const drawerTitle =
    drawerMode === "quiz" ? (activeQuiz?.title ?? "Quiz")
    : drawerMode === "project" ? (activeProject?.title ?? "Project")
    : undefined;

  return (
    <section className="grid gap-4">
      <Button variant="secondary" onClick={() => goModule(courseId, moduleId)} title="Back to module">
        <Icon icon={ArrowLeft} />
        Back to module
      </Button>

      <div className="flex min-h-[70vh] flex-col gap-0 overflow-hidden rounded-panel border border-border0 lg:flex-row">
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <LessonExplanationPanel title={lesson.title} markdown={lesson.markdown} />
          <div className="flex flex-wrap gap-2 border-t border-border0 p-4">
            {lessonQuizzes.map((quiz) => (
              <Button
                key={quiz.id}
                variant="secondary"
                size="md"
                onClick={() =>
                  openLessonDrawer(courseId, moduleId, lessonId, "quiz", quiz.id)
                }
              >
                Quiz: {quiz.title}
              </Button>
            ))}
            {lessonProjects.map((project) => (
              <Button
                key={project.id}
                variant="secondary"
                size="md"
                onClick={() =>
                  openLessonDrawer(courseId, moduleId, lessonId, "project", project.id)
                }
              >
                {project.title}
              </Button>
            ))}
          </div>
        </main>

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
            />
          ) : null}
        </Drawer>
      </div>
    </section>
  );
}
