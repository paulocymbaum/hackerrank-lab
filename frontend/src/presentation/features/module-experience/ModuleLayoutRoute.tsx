import { useParams, useSearchParams } from "react-router-dom";
import type { Course } from "../../../domain/types/catalog";
import { getModuleById } from "../../../application/selectors/catalogSelectors";
import { resolveActiveModulePageQuiz } from "../../../application/selectors/moduleSelectors";
import { useCourseRouteData } from "../../../application/hooks/useCourseRouteData";
import { useQuizSessionFromUrl } from "../../../application/hooks/useQuizSessionFromUrl";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { AsyncRouteBoundary } from "../../shared/AsyncRouteBoundary";
import { ErrorPanel } from "../../design-system";
import { ModuleLayoutProvider } from "./ModuleLayoutContext";
import { ModuleQuizPage } from "./ModuleQuizPage";
import { ModuleShellLayout } from "./ModuleShellLayout";

export function ModuleLayoutRoute() {
  const { courseId = "", moduleId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { course, status, error, reload } = useCourseRouteData(courseId);
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
      loadingMessage={t("module.loading")}
      errorTitle={t("error.loadCourse")}
      notFoundTitle={t("error.courseNotFound")}
      isEmpty={status === "ready" && !course}
    >
      {course ? (
        <ModuleLayoutBody
          courseId={courseId}
          moduleId={moduleId}
          course={course}
          activeQuizId={activeQuizId}
        />
      ) : null}
    </AsyncRouteBoundary>
  );
}

function ModuleLayoutBody(props: {
  courseId: string;
  moduleId: string;
  course: Course;
  activeQuizId: string | null;
}) {
  const { t } = useTranslation();
  const mod = getModuleById(props.course, props.moduleId);

  if (!mod) {
    return <ErrorPanel title={t("error.moduleNotFound")} />;
  }

  const activeModuleQuiz = resolveActiveModulePageQuiz(
    props.course,
    props.moduleId,
    props.activeQuizId,
  );

  if (activeModuleQuiz) {
    return (
      <ModuleQuizPage courseId={props.courseId} course={props.course} quiz={activeModuleQuiz} />
    );
  }

  return (
    <ModuleLayoutProvider
      value={{
        courseId: props.courseId,
        moduleId: props.moduleId,
        course: props.course,
        module: mod,
      }}
    >
      <ModuleShellLayout />
    </ModuleLayoutProvider>
  );
}
