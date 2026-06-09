import clsx from "clsx";
import type { Project } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import {
  buildLessonActivityItems,
  computeLessonProgress,
} from "../../../../application/selectors/lessonProgress";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useQuizProgressStore } from "../../../../application/stores/quizSessionStore";
import { ProgressBar } from "../../../design-system";
import { LessonActivitiesList } from "./LessonActivitiesList";

export function LessonProgressHeader(props: {
  courseId: string;
  lessonId: string;
  quizzes: Quiz[];
  projects: Project[];
}) {
  useQuizProgressStore((s) => s.byKey);
  useProjectProgressStore((s) => s.byKey);

  const items = buildLessonActivityItems({
    courseId: props.courseId,
    lessonId: props.lessonId,
    quizzes: props.quizzes,
    projects: props.projects,
  });
  const { done, total } = computeLessonProgress(items);

  if (total === 0) return null;

  return (
    <div className="sticky top-0 z-10 shrink-0 border-b border-border0 bg-glassFillStrong px-4 py-3 backdrop-blur-[var(--blur-2)]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="m-0 text-meta font-semibold text-text1">Lesson progress</p>
        <p className="m-0 text-meta text-text1">
          {done} of {total} complete
        </p>
      </div>
      <ProgressBar
        value={done}
        max={total}
        size="md"
        aria-label={`${done} of ${total} lesson activities complete`}
      />
    </div>
  );
}

export function LessonActivitiesPanel(props: {
  courseId: string;
  lessonId: string;
  quizzes: Quiz[];
  projects: Project[];
  activeQuizId: string | null;
  activeProjectId: string | null;
  onOpenQuiz: (quizId: string) => void;
  onOpenProject: (projectId: string) => void;
  className?: string;
}) {
  useQuizProgressStore((s) => s.byKey);
  useProjectProgressStore((s) => s.byKey);

  const items = buildLessonActivityItems({
    courseId: props.courseId,
    lessonId: props.lessonId,
    quizzes: props.quizzes,
    projects: props.projects,
  });

  if (items.length === 0) return null;

  const quizCount = items.filter((item) => item.kind === "quiz").length;
  const projectCount = items.filter((item) => item.kind === "project").length;

  return (
    <aside
      className={clsx(
        "flex min-h-0 shrink-0 flex-col border-border0 bg-surfacePanel",
        props.className,
      )}
    >
      <div className="border-b border-border0 px-4 py-3">
        <h2 className="m-0 text-body font-semibold text-text0">Quizzes & projects</h2>
        <p className="m-0 mt-1 text-meta text-text1">
          {quizCount} quiz{quizCount === 1 ? "" : "zes"} · {projectCount} project
          {projectCount === 1 ? "" : "s"}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <LessonActivitiesList
          variant="panel"
          items={items}
          activeQuizId={props.activeQuizId}
          activeProjectId={props.activeProjectId}
          onOpenQuiz={props.onOpenQuiz}
          onOpenProject={props.onOpenProject}
        />
      </div>
    </aside>
  );
}
