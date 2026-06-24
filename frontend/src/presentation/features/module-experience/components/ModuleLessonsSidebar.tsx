import type { Quiz } from "../../../../domain/types/quiz";
import { useLessonProgressLabel } from "../../../../application/hooks/useLocalizedLabels";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useQuizProgressStore } from "../../../../application/stores/quizSessionStore";
import { ActivitySidebarItem } from "../../../shared/ActivitySidebarItem";
import { ArtifactSection } from "../../../shared/ArtifactSection";
import { countLessonProgress, type LessonNavItem } from "../../../shared/lessonProgress";
import { QuizSidebarItem } from "../../../shared/QuizSidebarItem";
import { EmptyState } from "../../../design-system";

export function ModuleLessonsSidebar(props: {
  courseId: string;
  moduleTitle: string;
  lessons: LessonNavItem[];
  moduleQuizzes: Quiz[];
  onOpenLesson: (lessonId: string) => void;
  onOpenModuleQuiz: (quizId: string) => void;
}) {
  const { t } = useTranslation();
  const { formatLessonProgressLabel } = useLessonProgressLabel();
  const getQuizProgress = useQuizProgressStore((s) => s.getProgress);
  const getProjectStatus = useProjectProgressStore((s) => s.getStatus);

  const hasContent = props.lessons.length > 0 || props.moduleQuizzes.length > 0;

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden border-l border-border0 bg-surfaceModal">
      <div className="shrink-0 border-b border-border0 px-4 py-3">
        <div className="text-meta font-semibold text-text1">{t("module.thisModule")}</div>
        <div className="mt-0.5 truncate text-body font-semibold text-text0">{props.moduleTitle}</div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {!hasContent ? (
          <EmptyState
            title={t("module.noLessons.title")}
            description={t("module.noLessons.description")}
          />
        ) : (
          <div className="grid gap-4">
            {props.lessons.length > 0 ? (
              <ArtifactSection title={t("module.lessons")}>
                {props.lessons.map(({ lesson, quizzes, projects }) => {
                  const { done, total } = countLessonProgress({
                    courseId: props.courseId,
                    lessonId: lesson.id,
                    quizzes,
                    projects,
                    getQuizProgress,
                    getProjectStatus,
                  });
                  return (
                    <ActivitySidebarItem
                      key={lesson.id}
                      title={lesson.title}
                      scoreLabel={formatLessonProgressLabel(done, total)}
                      onClick={() => props.onOpenLesson(lesson.id)}
                    />
                  );
                })}
              </ArtifactSection>
            ) : null}

            {props.moduleQuizzes.length > 0 ? (
              <ArtifactSection title={t("module.quiz")}>
                {props.moduleQuizzes.map((quiz) => (
                  <QuizSidebarItem
                    key={quiz.id}
                    quiz={quiz}
                    progress={getQuizProgress(props.courseId, quiz.id, quiz.lessonId)}
                    onClick={() => props.onOpenModuleQuiz(quiz.id)}
                  />
                ))}
              </ArtifactSection>
            ) : null}
          </div>
        )}
      </div>
    </aside>
  );
}
