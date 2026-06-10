import { useParams, useSearchParams } from "react-router-dom";
import { useQuizSessionFromUrl } from "../../../application/hooks/useQuizSessionFromUrl";
import {
  getLessonById,
  getProjectsForLesson,
  getQuizzesForLesson,
} from "../../../application/selectors/catalogSelectors";
import { findQuizInList } from "../../../application/selectors/quizSelectors";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { Drawer } from "../../design-system";
import { ErrorPanel } from "../../design-system";
import { LessonExplanationPanel } from "./components/LessonExplanationPanel";
import { ProjectReader } from "../content-reader/ProjectReader";
import { QuizHost } from "../quiz/components/QuizHost";
import { useModuleLayoutContext } from "../module-experience/ModuleLayoutContext";

export function LessonWorkspaceRoute() {
  const { courseId, moduleId, course } = useModuleLayoutContext();
  const { lessonId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { closeLessonDrawer, setLessonDrawerTab, parseDrawerMode, parseDrawerTab } =
    useAppNavigation();

  const drawerMode = parseDrawerMode(searchParams.get("drawer"));
  const drawerTab = parseDrawerTab(searchParams.get("drawerTab"));
  const activeQuizId = searchParams.get("quiz");
  const activeProjectId = searchParams.get("project");

  useQuizSessionFromUrl({
    quizId: activeQuizId,
    lessonId,
    enabled: drawerMode === "quiz" && Boolean(activeQuizId),
  });

  const lesson = getLessonById(course, moduleId, lessonId);
  if (!lesson) {
    return <ErrorPanel title="Lesson not found." />;
  }

  const lessonQuizzes = getQuizzesForLesson(course, moduleId, lessonId);
  const lessonProjects = getProjectsForLesson(course, moduleId, lessonId);

  const activeQuiz = activeQuizId ? findQuizInList(lessonQuizzes, activeQuizId) : null;
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

  return (
    <section
      className={
        drawerOpen
          ? "flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row"
          : "flex min-h-0 flex-1 flex-col overflow-hidden"
      }
    >
      {!drawerOpen ? (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <LessonExplanationPanel title={lesson.title} markdown={lesson.markdown} showTitle={false} />
        </main>
      ) : null}

      <Drawer
        open={drawerOpen}
        onClose={() => closeLessonDrawer(courseId, moduleId, lessonId)}
        title={drawerTitle}
        className={drawerOpen ? "lg:min-w-0 lg:flex-1" : undefined}
      >
        {drawerMode === "quiz" && activeQuiz ? (
          <QuizHost
            layout="drawer"
            courseId={courseId}
            course={course}
            quiz={activeQuiz}
            onClose={() => closeLessonDrawer(courseId, moduleId, lessonId)}
          />
        ) : null}
        {drawerMode === "project" && activeProject ? (
          <ProjectReader
            layout="drawer"
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
