import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { isHierarchyCourse } from "../../../application/selectors/catalogSelectors";
import { CourseOverviewRoute } from "../course-overview/CourseOverviewRoute";
import { LegacyCourseRoute } from "../course-legacy/LegacyCourseRoute";
import { useCourseRouteData } from "../../../application/hooks/useCourseRouteData";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { AsyncRouteBoundary } from "../../shared/AsyncRouteBoundary";
import { Button, ErrorPanel, Icon } from "../../design-system";

export function CourseExperienceRoute() {
  const { courseId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { course, status, error, reload } = useCourseRouteData(courseId);
  const { goCatalog } = useAppNavigation();

  return (
    <AsyncRouteBoundary
      status={status}
      error={error}
      onRetry={reload}
      loadingMessage="Loading course…"
      errorTitle="Failed to load course catalog."
      notFoundTitle="Course not found."
      notFoundMessage="The course may have been removed or the link is invalid."
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
          title="Course not found."
          message="The course may have been removed or the link is invalid."
          action={
            <Button variant="secondary" onClick={goCatalog}>
              <Icon icon={ArrowLeft} />
              Back to catalog
            </Button>
          }
        />
      )}
    </AsyncRouteBoundary>
  );
}
