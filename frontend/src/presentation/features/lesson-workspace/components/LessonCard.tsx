import type { Lesson } from "../../../../domain/types/catalog";
import type { Project } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useQuizProgressStore } from "../../../../application/stores/quizSessionStore";
import { Card, ProgressBar } from "../../../design-system";

function lessonProgress(input: {
  courseId: string;
  lessonId: string;
  quizzes: Quiz[];
  projects: Project[];
}): { done: number; total: number } {
  const { courseId, lessonId, quizzes, projects } = input;
  const quizStore = useQuizProgressStore.getState();
  const projectStore = useProjectProgressStore.getState();

  const items: boolean[] = [];
  for (const quiz of quizzes) {
    const progress = quizStore.getProgress(courseId, quiz.id, lessonId);
    items.push((progress?.bestScore ?? 0) > 0);
  }
  for (const project of projects) {
    const status = projectStore.getStatus(courseId, project.id, lessonId);
    items.push(status === "done");
  }

  const done = items.filter(Boolean).length;
  return { done, total: items.length };
}

export function LessonCard(props: {
  courseId: string;
  lesson: Lesson;
  quizzes: Quiz[];
  projects: Project[];
  onOpen: () => void;
}) {
  const { done, total } = lessonProgress({
    courseId: props.courseId,
    lessonId: props.lesson.id,
    quizzes: props.quizzes,
    projects: props.projects,
  });

  return (
    <Card variant="panel" className="p-3">
      <button
        type="button"
        className="flex w-full flex-col gap-2 text-left"
        onClick={props.onOpen}
      >
        <div className="text-body font-medium text-text0">{props.lesson.title}</div>
        <div className="flex flex-wrap items-center gap-3 text-meta text-text1">
          <span>{props.quizzes.length} quiz</span>
          <span>{props.projects.length} projects</span>
        </div>
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
