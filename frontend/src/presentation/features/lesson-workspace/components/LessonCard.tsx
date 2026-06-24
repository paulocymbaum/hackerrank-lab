import type { Lesson } from "../../../../domain/types/catalog";
import type { Project } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useQuizProgressStore } from "../../../../application/stores/quizSessionStore";
import { Card, ProgressBar } from "../../../design-system";
import {
  countLessonProgress,
} from "../../../shared/lessonProgress";

export function LessonCard(props: {
  courseId: string;
  lesson: Lesson;
  quizzes: Quiz[];
  projects: Project[];
  onOpen: () => void;
}) {
  const getQuizProgress = useQuizProgressStore((s) => s.getProgress);
  const getProjectStatus = useProjectProgressStore((s) => s.getStatus);
  const { done, total } = countLessonProgress({
    courseId: props.courseId,
    lessonId: props.lesson.id,
    quizzes: props.quizzes,
    projects: props.projects,
    getQuizProgress,
    getProjectStatus,
  });

  return (
    <Card variant="panel" className="p-3">
      <button
        type="button"
        className="flex w-full flex-col gap-2 text-left"
        onClick={props.onOpen}
      >
        <div className="text-body font-medium text-text0">{props.lesson.title}</div>
        {total > 0 ? (
          <ProgressBar
            value={done}
            max={total}
            size="sm"
            aria-label={`${done} of ${total} lesson items complete`}
          />
        ) : null}
      </button>
    </Card>
  );
}
