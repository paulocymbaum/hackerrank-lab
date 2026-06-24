import type { Module } from "../../../../domain/types/catalog";
import { quizProgressKey } from "../../../../domain/types/quiz";
import { projectProgressKey } from "../../../../domain/types/quizScore";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useQuizProgressStore } from "../../../../application/stores/quizProgressStore";
import { ProgressBar } from "../../../design-system";

export function ModuleScoreSummary(props: { courseId: string; module: Module }) {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  const quizItems = props.module.quizzes.map((quiz) =>
    Boolean(quizByKey[quizProgressKey(props.courseId, quiz.id, quiz.lessonId)]?.bestScore),
  );
  const projectItems = props.module.projects.map((project) => {
    const status = projectByKey[projectProgressKey(props.courseId, project.id, project.lessonId)]
      ?.status;
    return status === "done";
  });

  const items = [...quizItems, ...projectItems];
  const done = items.filter(Boolean).length;
  const total = items.length;

  if (total === 0) return null;

  return (
    <ProgressBar
      value={done}
      max={total}
      size="xs"
      aria-label={`${done} of ${total} module items complete`}
    />
  );
}
