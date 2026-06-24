import type { Course } from "../../../domain/types/catalog";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { sortByGraphIndex } from "../../../application/selectors/lessonDisplay";
import { Card, Icon } from "../../design-system";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { hasDisplayableReadme } from "../../shared/readmeUtils";
import { ModuleScoreSummary } from "../course-experience/components/ModuleScoreSummary";
import { Box, ChevronRight } from "lucide-react";

export function CourseOverviewRoute(props: { courseId: string; course: Course }) {
  const { goModule } = useAppNavigation();
  const { t } = useTranslation();
  const modules = sortByGraphIndex(props.course.modules ?? []);
  const showReadme = hasDisplayableReadme(props.course.readmeMarkdown, props.course.title);

  return (
    <section className="grid gap-6">
      <div className="grid gap-4">
        {modules.map((mod) => {
          const moduleQuizzes = mod.quizzes.filter((q) => !q.lessonId).length;
          const lessonQuizzes = mod.quizzes.filter((q) => q.lessonId).length;
          const moduleIndex = mod.graphIndex ?? mod.id.match(/^(\d+)/)?.[1] ?? "";

          return (
            <Card key={mod.id} variant="panel" className="overflow-hidden p-0">
              <button
                type="button"
                className="flex w-full items-start gap-4 p-4 text-left transition hover:bg-surfacePanel/60"
                onClick={() => goModule(props.courseId, mod.id)}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-panel border border-accent0/25 bg-surfaceAccent text-accent0"
                  aria-hidden
                >
                  <Icon icon={Box} size={20} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {moduleIndex ? (
                      <span className="rounded-pill border border-border0 bg-surfaceControl px-2 py-0.5 font-mono text-meta font-semibold text-accent0">
                        {moduleIndex}
                      </span>
                    ) : null}
                    <span className="text-body font-semibold text-text0">{mod.title}</span>
                  </span>
                  <span className="mt-2 block text-meta text-text1">
                    {t("course.moduleLessons", {
                      lessons: mod.lessons.length,
                      projects: mod.projects.length,
                    })}
                    {lessonQuizzes > 0
                      ? t("course.lessonQuizSuffix", { count: lessonQuizzes })
                      : ""}
                    {moduleQuizzes > 0
                      ? t("course.moduleQuizSuffix", { count: moduleQuizzes })
                      : ""}
                  </span>
                  <ModuleScoreSummary courseId={props.courseId} module={mod} />
                </span>

                <Icon icon={ChevronRight} size={18} className="mt-1 shrink-0 text-text1" />
              </button>
            </Card>
          );
        })}
      </div>

      {showReadme ? (
        <Card variant="panel" className="p-4">
          <ReadmePanel
            markdown={props.course.readmeMarkdown}
            title={props.course.title}
            variant="card"
          />
        </Card>
      ) : null}
    </section>
  );
}
