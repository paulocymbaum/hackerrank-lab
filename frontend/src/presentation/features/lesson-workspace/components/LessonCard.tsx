import type { Lesson } from "../../../../domain/types/catalog";
import type { Project } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import {
  buildLessonActivityItems,
  computeLessonProgress,
} from "../../../../application/selectors/lessonProgress";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useQuizProgressStore } from "../../../../application/stores/quizSessionStore";
import { Card, ProgressBar } from "../../../design-system";
import { LessonActivitiesList } from "./LessonActivitiesList";

export function LessonCard(props: {
  courseId: string;
  lesson: Lesson;
  quizzes: Quiz[];
  projects: Project[];
  onOpen: () => void;
  onOpenQuiz?: (quizId: string) => void;
  onOpenProject?: (projectId: string) => void;
}) {
  useQuizProgressStore((s) => s.byKey);
  useProjectProgressStore((s) => s.byKey);

  const items = buildLessonActivityItems({
    courseId: props.courseId,
    lessonId: props.lesson.id,
    quizzes: props.quizzes,
    projects: props.projects,
  });
  const { done, total } = computeLessonProgress(items);
  const canOpenActivities = Boolean(props.onOpenQuiz || props.onOpenProject);

  return (
    <Card variant="panel" className="p-3">
      <button
        type="button"
        className="flex w-full flex-col gap-2 text-left"
        onClick={props.onOpen}
      >
        <div className="text-body font-medium text-text0">{props.lesson.title}</div>
        {total > 0 ? (
          canOpenActivities ? (
            <div onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
              <ProgressBar
                value={done}
                max={total}
                size="sm"
                aria-label={`${done} of ${total} lesson items complete`}
                popoverLabel="Open lesson activities"
                popoverContent={({ close }) => (
                  <LessonActivitiesList
                    items={items}
                    activeQuizId={null}
                    activeProjectId={null}
                    onOpenQuiz={(quizId) => {
                      props.onOpenQuiz?.(quizId);
                      close();
                    }}
                    onOpenProject={(projectId) => {
                      props.onOpenProject?.(projectId);
                      close();
                    }}
                  />
                )}
              />
            </div>
          ) : (
            <ProgressBar
              value={done}
              max={total}
              size="sm"
              aria-label={`${done} of ${total} lesson items complete`}
            />
          )
        ) : null}
      </button>
    </Card>
  );
}
