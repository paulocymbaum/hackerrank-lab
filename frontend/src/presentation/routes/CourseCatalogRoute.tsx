import { useEffect } from "react";
import { useCourseCatalogStore } from "../../application/stores/courseCatalogStore";
import { useNavigationStore } from "../../application/stores/navigationStore";
import { Card } from "../design-system/components/Card";
import { Icon } from "../design-system/icons/Icon";
import { BookOpenText, ChevronRight } from "lucide-react";
import { Button } from "../design-system/components/Button";

export function CourseCatalogRoute() {
  const status = useCourseCatalogStore((s) => s.status);
  const courses = useCourseCatalogStore((s) => s.courses);
  const error = useCourseCatalogStore((s) => s.error);
  const load = useCourseCatalogStore((s) => s.load);
  const goCourse = useNavigationStore((s) => s.goCourse);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === "loading") {
    return <p className="text-text1">Loading catalog…</p>;
  }

  if (status === "error") {
    return (
      <div className="rounded-panel border border-border0 bg-glassFill p-4 shadow-glass1 backdrop-blur-[var(--blur-2)]">
        <p className="m-0 text-[14px] font-medium text-danger0">Failed to load catalog.</p>
        {error ? (
          <pre className="mt-2 whitespace-pre-wrap text-[12px] text-text1">{error}</pre>
        ) : null}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="m-0 text-[14px] font-semibold text-text0">Courses</h2>
        <div className="flex items-center gap-2 text-[12px] text-text1">
          <Icon icon={BookOpenText} />
          <span>{courses.length}</span>
        </div>
      </div>

      {courses.length === 0 ? <p className="text-text1">No courses found.</p> : null}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.id} variant="panel" className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold text-text0">{course.title}</div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-text1">
                  <span>{course.lessons.length} examples</span>
                  <span>{course.projects.length} projects</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => goCourse(course.id)}
                title="Open immersive course view"
              >
                See course
                <Icon icon={ChevronRight} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

