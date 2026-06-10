import { Outlet, useParams, useSearchParams } from "react-router-dom";
import { getModuleById, getQuizzesForModule } from "../../../application/selectors/catalogSelectors";
import { getQuizById } from "../../../application/selectors/quizSelectors";
import { useCourseRouteData } from "../../../application/hooks/useCourseRouteData";
import { useQuizSessionFromUrl } from "../../../application/hooks/useQuizSessionFromUrl";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { AsyncRouteBoundary } from "../../shared/AsyncRouteBoundary";
import { ErrorPanel } from "../../design-system";
import { QuizHost } from "../quiz/components/QuizHost";
import { ModuleContentsDrawer } from "./components/ModuleContentsDrawer";
import { ModuleLayoutProvider } from "./ModuleLayoutContext";

export function ModuleLayoutRoute() {
  const { courseId = "", moduleId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { course, status, error, reload } = useCourseRouteData(courseId);
  const { goModule, goLesson, openLessonDrawer, openModuleQuiz, closeQuiz } = useAppNavigation();
  const activeQuizId = searchParams.get("quiz");

  useQuizSessionFromUrl({
    quizId: activeQuizId,
    enabled: Boolean(activeQuizId && course),
  });

  return (
    <AsyncRouteBoundary
      status={status}
      error={error}
      onRetry={reload}
      loadingMessage="Loading module…"
      errorTitle="Failed to load course."
      notFoundTitle="Course not found."
      isEmpty={status === "ready" && !course}
    >
      {course ? (
        (() => {
          const mod = getModuleById(course, moduleId);
          if (!mod) {
            return <ErrorPanel title="Module not found." />;
          }

          const moduleQuizzes = getQuizzesForModule(course, moduleId).filter((q) => !q.lessonId);
          const activeQuiz = activeQuizId
            ? getQuizById(course, activeQuizId, { moduleId })
            : null;

          if (activeQuiz && moduleQuizzes.some((q) => q.id === activeQuiz.id)) {
            return (
              <QuizHost
                layout="page"
                courseId={courseId}
                course={course}
                quiz={activeQuiz}
                onClose={closeQuiz}
              />
            );
          }

          return (
            <ModuleLayoutProvider value={{ courseId, moduleId, course, module: mod }}>
              <section className="flex min-h-[70vh] flex-col lg:flex-row lg:items-stretch">
                <ModuleContentsDrawer
                  course={course}
                  module={mod}
                  courseId={courseId}
                  moduleId={moduleId}
                  onOpenLesson={(lessonId) => goLesson(courseId, moduleId, lessonId)}
                  onOpenLessonQuiz={(lessonId, quizId) =>
                    openLessonDrawer(courseId, moduleId, lessonId, "quiz", quizId)
                  }
                  onOpenLessonProject={(lessonId, projectId) =>
                    openLessonDrawer(courseId, moduleId, lessonId, "project", projectId, "files")
                  }
                  onOpenModuleQuiz={(quizId) => openModuleQuiz(courseId, moduleId, quizId)}
                  onOpenModuleContext={() => goModule(courseId, moduleId)}
                />

                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-border0 bg-surfacePanel lg:border lg:border-l-0 lg:rounded-r-panel">
                  <Outlet />
                </div>
              </section>
            </ModuleLayoutProvider>
          );
        })()
      ) : null}
    </AsyncRouteBoundary>
  );
}
