import { useEffect } from "react";
import { useCourseCatalogStore } from "../../application/stores/courseCatalogStore";
import { Accordion } from "../design-system/components/Accordion";
import { Icon } from "../design-system/icons/Icon";
import { BookOpenText } from "lucide-react";

export function CourseCatalogRoute() {
  const status = useCourseCatalogStore((s) => s.status);
  const courses = useCourseCatalogStore((s) => s.courses);
  const error = useCourseCatalogStore((s) => s.error);
  const load = useCourseCatalogStore((s) => s.load);

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
          <Accordion
            key={course.id}
            title={
              <div className="min-w-0">
                <span className="truncate text-[14px] font-semibold">{course.title}</span>
              </div>
            }
          >
            {course.lessons.length === 0 ? (
              <p className="m-0 text-[13px] text-text1">No lessons found in `examples/`.</p>
            ) : (
              <ol className="m-0 grid gap-2 pl-5">
                {course.lessons.map((lesson) => (
                  <li key={lesson.path}>
                    <span className="text-[14px] font-medium text-text0">{lesson.title}</span>
                  </li>
                ))}
              </ol>
            )}
          </Accordion>
        ))}
      </div>
    </section>
  );
}

