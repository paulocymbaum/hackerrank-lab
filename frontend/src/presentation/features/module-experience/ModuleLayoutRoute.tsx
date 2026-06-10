import { useEffect } from "react";
import { Outlet, useParams, useSearchParams } from "react-router-dom";
import { getModuleById, getQuizzesForModule } from "../../../application/selectors/catalogSelectors";
import { getQuizById, quizSessionKey } from "../../../application/selectors/quizSelectors";
import { useCourse } from "../../../application/hooks/useCourse";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useQuizSessionStore } from "../../../application/stores/quizSessionStore";
import { loadCourseScores } from "../../../application/usecases/courseScores";
import { ErrorPanel, LoadingState } from "../../design-system";
import { QuizSessionPanel } from "../quiz/components/QuizSessionPanel";
import { ModuleContentsDrawer } from "./components/ModuleContentsDrawer";

export function ModuleLayoutRoute() {
  const { courseId = "", moduleId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { course, status, error, load, reload } = useCourse(courseId);
  const { goModule, goLesson, openLessonDrawer, openModuleQuiz, closeQuiz } = useAppNavigation();
  const activeQuizId = searchParams.get("quiz");

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  useEffect(() => {
    if (!courseId || status !== "ready") return;
    void loadCourseScores(courseId);
  }, [courseId, status]);

  useEffect(() => {
    if (!activeQuizId || !course) return;
    const session = useQuizSessionStore.getState();
    const nextKey = quizSessionKey(activeQuizId);
    if (session.sessionKey !== nextKey) session.start(activeQuizId);
  }, [activeQuizId, course]);

  if (status === "loading" || status === "idle") {
    return <LoadingState message="Loading module…" />;
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
  if (!mod) {
    return <ErrorPanel title="Module not found." />;
  }

  const moduleQuizzes = getQuizzesForModule(course, moduleId).filter((q) => !q.lessonId);
  const activeQuiz = activeQuizId
    ? getQuizById(course, activeQuizId, { moduleId })
    : null;

  if (activeQuiz && moduleQuizzes.some((q) => q.id === activeQuiz.id)) {
    return (
      <QuizSessionPanel
        courseId={courseId}
        course={course}
        quiz={activeQuiz}
        onBackToList={closeQuiz}
      />
    );
  }

  return (
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
  );
}
