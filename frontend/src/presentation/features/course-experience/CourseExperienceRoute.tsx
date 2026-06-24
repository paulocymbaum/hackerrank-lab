import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { isHierarchyCourse } from "../../../application/selectors/catalogSelectors";
import { CourseOverviewRoute } from "../course-overview/CourseOverviewRoute";
import { LegacyCourseRoute } from "../course-legacy/LegacyCourseRoute";
import { useCourseRouteData } from "../../../application/hooks/useCourseRouteData";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { AsyncRouteBoundary } from "../../shared/AsyncRouteBoundary";
import { Button, ErrorPanel, Icon } from "../../design-system";

export function CourseExperienceRoute() {
  const { courseId = "" } = useParams();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { course, status, error, reload } = useCourseRouteData(courseId);
  const { goCatalog } = useAppNavigation();

  return (
    <AsyncRouteBoundary
      status={status}
      error={error}
      onRetry={reload}
      loadingMessage={t("course.loading")}
      errorTitle={t("error.loadCatalogDetailed")}
      notFoundTitle={t("error.courseNotFound")}
      notFoundMessage={t("course.notFoundMessage")}
      isEmpty={status === "ready" && !course}
    >
      {course ? (
        (() => {
          if (isHierarchyCourse(course)) {
            if (searchParams.has("tab") || searchParams.has("reader")) {
              return <Navigate to={`/course/${encodeURIComponent(courseId)}`} replace />;
            }
            return <CourseOverviewRoute courseId={courseId} course={course} />;
          }

          return <LegacyCourseRoute courseId={courseId} course={course} />;
        })()
      ) : (
        <ErrorPanel
          title={t("error.courseNotFound")}
          message={t("course.notFoundMessage")}
          action={
            <Button variant="secondary" onClick={goCatalog}>
              <Icon icon={ArrowLeft} />
              {t("course.backToCatalog")}
            </Button>
          }
        />
      )}
    </AsyncRouteBoundary>
  );
}
