import { useEffect } from "react";
import { BookOpenText } from "lucide-react";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useCatalogPoints } from "../../../application/hooks/useCatalogPoints";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { loadAllCourseScores } from "../../../application/usecases/loadAllCourseScores";
import { migrateProgressKeysFromCatalog } from "../../../application/usecases/migrateProgressKeys";
import { ErrorPanel, Icon, LoadingState } from "../../design-system";
import { CatalogScoreSummary } from "../course-experience/components/CourseScoreSummary";
import { CourseCard } from "./components/CourseCard";
import { CatalogEmptyState } from "./components/CatalogEmptyState";

export function CatalogRoute() {
  const { status, courses, error, load, reload } = useCatalog();
  const { goCourse } = useAppNavigation();
  const catalogPoints = useCatalogPoints(courses);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (status !== "ready" || courses.length === 0) return;
    migrateProgressKeysFromCatalog({ courses });
    void loadAllCourseScores(courses);
  }, [status, courses]);

  if (status === "loading" || status === "idle") {
    return <LoadingState message="Loading catalog…" />;
  }

  if (status === "error") {
    return (
      <ErrorPanel
        title="Failed to load catalog."
        message={error ?? undefined}
        onRetry={() => void reload()}
      />
    );
  }

  return (
    <section>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="m-0 text-body font-semibold text-text0">Courses</h2>
        <div className="flex flex-wrap items-center gap-3">
          <CatalogScoreSummary
            totalPoints={catalogPoints.totalPoints}
            totalMax={catalogPoints.totalMax}
            quizPoints={catalogPoints.quizPoints}
            quizMax={catalogPoints.quizMax}
            projectPoints={catalogPoints.projectPoints}
            projectMax={catalogPoints.projectMax}
          />
          <div className="flex items-center gap-2 text-meta text-text1">
            <Icon icon={BookOpenText} />
            <span>{courses.length}</span>
          </div>
        </div>
      </div>

      {courses.length === 0 ? <CatalogEmptyState /> : null}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            courseId={course.id}
            course={course}
            onOpen={() => goCourse(course.id)}
          />
        ))}
      </div>
    </section>
  );
}
