import clsx from "clsx";
import { BookOpenText, CheckCircle2, FileCode, HelpCircle } from "lucide-react";
import type { Lesson } from "../../../../domain/types/catalog";
import type { Project } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import { getLessonDisplayIndex } from "../../../../application/selectors/lessonDisplay";
import {
  buildLessonActivityItems,
  computeLessonProgress,
  type LessonActivityItem,
} from "../../../../application/selectors/lessonProgress";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useQuizProgressStore } from "../../../../application/stores/quizSessionStore";
import { Card, Icon, ProgressBar } from "../../../design-system";

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
  const displayIndex = getLessonDisplayIndex(props.lesson);
  const hasActivities = items.length > 0;

  return (
    <Card
      variant="panel"
      className="group overflow-hidden transition hover:border-accent0/30 hover:shadow-glass2"
    >
      <div className="flex gap-3 p-3">
        <span
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-panel border",
            "border-accent0/25 bg-surfaceAccent text-accent0",
          )}
          aria-hidden
        >
          <Icon icon={BookOpenText} size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60"
            onClick={props.onOpen}
          >
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="rounded-pill border border-border0 bg-surfaceControl px-2 py-0.5 font-mono text-meta font-semibold text-text1">
                {displayIndex}
              </span>
              <span className="text-body font-semibold text-text0">{props.lesson.title}</span>
            </span>
          </button>

          {hasActivities ? (
            <ul className="m-0 mt-2 grid list-none gap-1 p-0" role="list">
              {items.map((item) => (
                <LessonActivityRow
                  key={`${item.kind}-${item.id}`}
                  item={item}
                  displayIndex={displayIndex}
                  onOpen={() => {
                    if (item.kind === "quiz") props.onOpenQuiz?.(item.id);
                    else props.onOpenProject?.(item.id);
                  }}
                  disabled={
                    item.kind === "quiz" ? !props.onOpenQuiz : !props.onOpenProject
                  }
                />
              ))}
            </ul>
          ) : (
            <p className="m-0 mt-2 text-meta text-text1">Explanation only</p>
          )}

          {total > 0 ? (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between gap-2 text-meta text-text1">
                <span>Progress</span>
                <span>
                  {done}/{total}
                </span>
              </div>
              <ProgressBar
                value={done}
                max={total}
                size="xs"
                aria-label={`${done} of ${total} lesson activities complete`}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function LessonActivityRow(props: {
  item: LessonActivityItem;
  displayIndex: string;
  onOpen: () => void;
  disabled?: boolean;
}) {
  const { item } = props;

  return (
    <li className="list-none" role="listitem">
      <button
        type="button"
        disabled={props.disabled}
        onClick={props.onOpen}
        className={clsx(
          "flex w-full items-center gap-2 rounded-panel border px-2 py-1.5 text-left transition",
          "hover:border-border0 hover:bg-surfacePanel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
          "disabled:cursor-default disabled:opacity-60",
          item.done
            ? "border-successBorder/40 bg-successFill/30"
            : "border-transparent bg-transparent",
        )}
      >
        <span className="w-[3.25rem] shrink-0 font-mono text-meta text-text2">{props.displayIndex}</span>
        <span
          className={clsx(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-panel border",
            item.done
              ? "border-successBorder bg-successFill text-successIcon"
              : "border-border0 bg-surfaceControl text-text1",
          )}
        >
          {item.done ? (
            <Icon icon={CheckCircle2} size={14} />
          ) : item.kind === "quiz" ? (
            <Icon icon={HelpCircle} size={14} />
          ) : (
            <Icon icon={FileCode} size={14} />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-meta font-medium text-text0">
            {item.kind === "quiz" ? "Quiz" : "Project"} · {item.title}
          </span>
          <span className="block text-meta text-text2">{item.statusLabel}</span>
        </span>
      </button>
    </li>
  );
}
