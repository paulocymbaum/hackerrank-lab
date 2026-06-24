import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { getModuleById } from "../../../application/selectors/catalogSelectors";
import { getQuizById } from "../../../application/selectors/quizSelectors";
import { useCourse } from "../../../application/hooks/useCourse";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useQuizSessionStore } from "../../../application/stores/quizSessionStore";
import { loadCourseScores } from "../../../application/usecases/courseScores";
import { ErrorPanel, LoadingState } from "../../design-system";
import { ActivityScreenLayout } from "../../shared/ActivityScreenLayout";
import { QuizSessionPanel } from "./components/QuizSessionPanel";

export function QuizActivityRoute() {
  const { courseId = "", moduleId = "", lessonId, quizId = "" } = useParams();
  const { t } = useTranslation();
  const { course, status, error, load, reload } = useCourse(courseId);
  const { goModule, goLesson } = useAppNavigation();

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  useEffect(() => {
    if (!courseId || status !== "ready") return;
    void loadCourseScores(courseId);
  }, [courseId, status]);

  useEffect(() => {
    if (!quizId) return;
    const session = useQuizSessionStore.getState();
    if (session.quizId !== quizId) session.start(quizId);
  }, [quizId]);

  if (status === "loading" || status === "idle") {
    return <LoadingState message={t("quiz.loading")} />;
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
  const quiz = getQuizById(course, quizId);
  if (!mod || !quiz) {
    return <ErrorPanel title={t("error.quizNotFound")} />;
  }

  const backLabel = lessonId ? t("lesson.backToLesson") : t("lesson.backToModule");
  const onBack = () => {
    useQuizSessionStore.getState().reset();
    if (lessonId) goLesson(courseId, moduleId, lessonId);
    else goModule(courseId, moduleId);
  };

  return (
    <ActivityScreenLayout title={quiz.title} backLabel={backLabel} onBack={onBack}>
      <QuizSessionPanel
        courseId={courseId}
        course={course}
        quiz={quiz}
        onBackToList={onBack}
        compact
      />
    </ActivityScreenLayout>
  );
}
