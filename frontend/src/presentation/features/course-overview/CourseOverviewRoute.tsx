import { ArrowLeft } from "lucide-react";
import type { Course } from "../../../domain/types/catalog";
import { countCourseLessons } from "../../../application/selectors/catalogSelectors";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { Button, Card, Icon } from "../../design-system";
import { MarkdownView } from "../../shared/MarkdownView";
import { CourseScoreSummary } from "../course-experience/components/CourseScoreSummary";
import { ModuleScoreSummary } from "../course-experience/components/ModuleScoreSummary";

export function CourseOverviewRoute(props: { courseId: string; course: Course }) {
  const { goCatalog, goModule } = useAppNavigation();
  const modules = props.course.modules ?? [];

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={goCatalog} title="Back to catalog">
          <Icon icon={ArrowLeft} />
          Back
        </Button>
        <CourseScoreSummary courseId={props.courseId} course={props.course} variant="compact" />
      </div>

      <Card variant="panel" className="p-4">
        <h1 className="m-0 mb-3 text-title font-semibold text-text0">{props.course.title}</h1>
        <MarkdownView markdown={props.course.readmeMarkdown} />
      </Card>

      <div className="grid gap-3">
        <h2 className="m-0 text-body font-semibold text-text0">Modules</h2>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {modules.map((mod) => (
            <Card key={mod.id} variant="panel" className="p-4">
              <button
                type="button"
                className="flex w-full flex-col gap-2 text-left"
                onClick={() => goModule(props.courseId, mod.id)}
              >
                <div className="text-body font-semibold text-text0">{mod.title}</div>
                <div className="text-meta text-text1">
                  {mod.lessons.length} lessons · {mod.projects.length} projects ·{" "}
                  {mod.quizzes.length} quizzes
                </div>
                <ModuleScoreSummary courseId={props.courseId} module={mod} />
              </button>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-meta text-text1">
        {modules.length} modules · {countCourseLessons(props.course)} lessons total
      </div>
    </section>
  );
}
