import type { Course } from "../../../domain/types/catalog";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { Card } from "../../design-system";
import { ReadmeContent } from "../../shared/ReadmeContent";
import { ModuleScoreSummary } from "../course-experience/components/ModuleScoreSummary";

export function CourseOverviewRoute(props: { courseId: string; course: Course }) {
  const { goModule } = useAppNavigation();
  const modules = props.course.modules ?? [];

  return (
    <section className="grid gap-4">
      <Card variant="panel" className="p-4">
        <ReadmeContent markdown={props.course.readmeMarkdown} />
      </Card>

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
                {mod.lessons.length} lessons · {mod.projects.length} projects
                {mod.quizzes.length > 0 ? ` · ${mod.quizzes.length} module quiz` : ""}
              </div>
              <ModuleScoreSummary courseId={props.courseId} module={mod} />
            </button>
          </Card>
        ))}
      </div>
    </section>
  );
}
