import { useEffect } from "react";
import { BookOpenText } from "lucide-react";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { ErrorPanel, Icon, LoadingState } from "../../design-system";
import { CourseCard } from "./components/CourseCard";
import { CatalogEmptyState } from "./components/CatalogEmptyState";

export function CatalogRoute() {
  const { status, courses, error, load, reload } = useCatalog();
  const { goCourse } = useAppNavigation();

  useEffect(() => {
    void load();
  }, [load]);

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
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="m-0 text-body font-semibold text-text0">Courses</h2>
        <div className="flex items-center gap-2 text-meta text-text1">
          <Icon icon={BookOpenText} />
          <span>{courses.length}</span>
        </div>
      </div>

      {courses.length === 0 ? <CatalogEmptyState /> : null}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onOpen={() => goCourse(course.id)} />
        ))}
      </div>
    </section>
  );
}
