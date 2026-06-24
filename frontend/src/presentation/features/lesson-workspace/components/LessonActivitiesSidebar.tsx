import type { Project } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import { useActivityScoreLabels } from "../../../../application/hooks/useLocalizedLabels";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useQuizProgressStore } from "../../../../application/stores/quizSessionStore";
import { ActivitySidebarItem } from "../../../shared/ActivitySidebarItem";
import { ArtifactSection } from "../../../shared/ArtifactSection";
import { EmptyState } from "../../../design-system";

export function LessonActivitiesSidebar(props: {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  quizzes: Quiz[];
  projects: Project[];
  activeQuizId?: string | null;
  activeProjectId?: string | null;
  onOpenQuiz: (quizId: string) => void;
  onOpenProject: (projectId: string) => void;
}) {
  const { t } = useTranslation();
  const { formatQuizScoreLabel, formatProjectScoreLabel } = useActivityScoreLabels();
  const getQuizProgress = useQuizProgressStore((s) => s.getProgress);
  const getProjectStatus = useProjectProgressStore((s) => s.getStatus);
  const getProjectProgress = useProjectProgressStore((s) => s.getProgress);

  const hasActivities = props.quizzes.length > 0 || props.projects.length > 0;

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden border-l border-border0 bg-surfaceModal">
      <div className="shrink-0 border-b border-border0 px-4 py-3">
        <div className="text-meta font-semibold text-text1">{t("lesson.thisLesson")}</div>
        <div className="mt-0.5 truncate text-body font-semibold text-text0">{props.lessonTitle}</div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {!hasActivities ? (
          <EmptyState
            title={t("lesson.noActivities.title")}
            description={t("lesson.noActivities.description")}
          />
        ) : (
          <div className="grid gap-4">
            {props.projects.length > 0 ? (
              <ArtifactSection title={t("lesson.projects")}>
                {props.projects.map((project) => {
                  const status = getProjectStatus(props.courseId, project.id, props.lessonId);
                  const progress = getProjectProgress(
                    props.courseId,
                    project.id,
                    props.lessonId,
                  );
                  return (
                    <ActivitySidebarItem
                      key={project.id}
                      title={project.title}
                      scoreLabel={formatProjectScoreLabel(status, progress?.points ?? 0)}
                      active={props.activeProjectId === project.id}
                      onClick={() => props.onOpenProject(project.id)}
                    />
                  );
                })}
              </ArtifactSection>
            ) : null}

            {props.quizzes.length > 0 ? (
              <ArtifactSection title={t("lesson.quizzes")}>
                {props.quizzes.map((quiz) => {
                  const progress = getQuizProgress(props.courseId, quiz.id, props.lessonId);
                  return (
                    <ActivitySidebarItem
                      key={quiz.id}
                      title={quiz.title}
                      scoreLabel={formatQuizScoreLabel(quiz, progress)}
                      active={props.activeQuizId === quiz.id}
                      onClick={() => props.onOpenQuiz(quiz.id)}
                    />
                  );
                })}
              </ArtifactSection>
            ) : null}
          </div>
        )}
      </div>
    </aside>
  );
}
