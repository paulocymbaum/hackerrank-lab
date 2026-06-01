import { useEffect, useMemo, useState } from "react";
import { useCourseCatalogStore } from "../../application/stores/courseCatalogStore";
import { useNavigationStore } from "../../application/stores/navigationStore";
import { useContentReaderStore } from "../../application/stores/contentReaderStore";
import { Button } from "../design-system/components/Button";
import { Card } from "../design-system/components/Card";
import { MarkdownView } from "../components/MarkdownView";
import { Icon } from "../design-system/icons/Icon";
import { ArrowLeft, BookOpenText, ClipboardList, FileText } from "lucide-react";

export function CourseExperienceRoute(props: { courseId: string }) {
  const status = useCourseCatalogStore((s) => s.status);
  const courses = useCourseCatalogStore((s) => s.courses);
  const load = useCourseCatalogStore((s) => s.load);
  const goCatalog = useNavigationStore((s) => s.goCatalog);
  const openReader = useContentReaderStore((s) => s.open);
  const [tab, setTab] = useState<"readme" | "examples" | "projects">("readme");

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  const course = useMemo(
    () => courses.find((c) => c.id === props.courseId) ?? null,
    [courses, props.courseId],
  );

  if (status === "loading" || status === "idle") {
    return <p className="text-text1">Loading course…</p>;
  }

  if (!course) {
    return (
      <div className="grid gap-3">
        <p className="m-0 text-text1">Course not found.</p>
        <div>
          <Button variant="secondary" onClick={goCatalog}>
            <Icon icon={ArrowLeft} />
            Back to catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={goCatalog} title="Back to catalog">
          <Icon icon={ArrowLeft} />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant={tab === "readme" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTab("readme")}
            title="Course README"
          >
            <Icon icon={FileText} />
            README
          </Button>
          <Button
            variant={tab === "examples" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTab("examples")}
            title="Examples"
          >
            <Icon icon={BookOpenText} />
            Examples
          </Button>
          <Button
            variant={tab === "projects" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTab("projects")}
            title="Projects"
          >
            <Icon icon={ClipboardList} />
            Projects
          </Button>
        </div>
      </div>

      {tab === "readme" ? (
        <Card variant="panel" className="p-4">
          <MarkdownView markdown={course.readmeMarkdown} />
        </Card>
      ) : null}

      {tab === "examples" ? (
        <Card variant="panel" className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-text1">
              <Icon icon={BookOpenText} />
              <span>Examples</span>
            </div>
            <div className="text-[12px] text-text1">{course.lessons.length}</div>
          </div>

          {course.lessons.length === 0 ? (
            <p className="m-0 text-[13px] text-text1">No examples.</p>
          ) : (
            <ol className="m-0 grid gap-2 pl-5">
              {course.lessons.map((lesson) => (
                <li key={lesson.path}>
                  <button
                    type="button"
                    className="text-left text-[14px] font-medium text-text0 underline decoration-border0 underline-offset-4 hover:decoration-text1"
                    onClick={() =>
                      openReader({
                        kind: "lesson",
                        title: lesson.title,
                        path: lesson.path,
                        markdown: lesson.markdown,
                        entries: [
                          {
                            path: lesson.path.split("/").slice(-1)[0] ?? lesson.path,
                            kind: "file",
                            content: lesson.markdown,
                          },
                        ],
                      })
                    }
                  >
                    {lesson.title}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </Card>
      ) : null}

      {tab === "projects" ? (
        <Card variant="panel" className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-text1">
              <Icon icon={ClipboardList} />
              <span>Projects</span>
            </div>
            <div className="text-[12px] text-text1">{course.projects.length}</div>
          </div>

          {course.projects.length === 0 ? (
            <p className="m-0 text-[13px] text-text1">No projects.</p>
          ) : (
            <ol className="m-0 grid gap-2 pl-5">
              {course.projects.map((project) => (
                <li key={project.readmePath}>
                  <button
                    type="button"
                    className="text-left text-[14px] font-medium text-text0 underline decoration-border0 underline-offset-4 hover:decoration-text1"
                    onClick={() =>
                      openReader({
                        kind: "project",
                        title: project.title,
                        path: project.readmePath,
                        markdown: project.readmeMarkdown,
                        rootPath: project.rootPath,
                        entries: project.entries,
                      })
                    }
                  >
                    {project.title}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </Card>
      ) : null}
    </section>
  );
}

