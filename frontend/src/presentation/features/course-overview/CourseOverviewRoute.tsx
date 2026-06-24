import type { Course } from "../../../domain/types/catalog";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { Card } from "../../design-system";
import { ReadmeContent } from "../../shared/ReadmeContent";
import { hasSubstantiveMarkdown } from "../../shared/utils/markdownContent";
import { ModuleScoreSummary } from "../course-experience/components/ModuleScoreSummary";

export function CourseOverviewRoute(props: { courseId: string; course: Course }) {
  const { goModule } = useAppNavigation();
  const { t } = useTranslation();
  const modules = props.course.modules ?? [];
  const showReadme = hasSubstantiveMarkdown(props.course.readmeMarkdown);

  return (
    <section className="grid gap-4">
      {showReadme ? (
        <Card variant="panel" className="p-4">
          <ReadmeContent markdown={props.course.readmeMarkdown} />
        </Card>
      ) : null}

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
                {t("course.moduleLessons", {
                  lessons: mod.lessons.length,
                  projects: mod.projects.length,
                })}
                {mod.quizzes.length > 0
                  ? t("course.moduleQuizSuffix", { count: mod.quizzes.length })
                  : ""}
              </div>
              <ModuleScoreSummary courseId={props.courseId} module={mod} />
            </button>
          </Card>
        ))}
      </div>
    </section>
  );
}
