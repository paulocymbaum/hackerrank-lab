import clsx from "clsx";
import { CheckCircle2, ChevronRight, FileCode, HelpCircle } from "lucide-react";
import type { ReactNode } from "react";
import type { LessonActivityItem } from "../../../../application/selectors/lessonProgress";
import { Icon } from "../../../design-system";

export function LessonActivitiesList(props: {
  items: LessonActivityItem[];
  activeQuizId: string | null;
  activeProjectId: string | null;
  onOpenQuiz: (quizId: string) => void;
  onOpenProject: (projectId: string) => void;
  variant?: "popover" | "panel";
}) {
  const variant = props.variant ?? "popover";
  const quizzes = props.items.filter((item) => item.kind === "quiz");
  const projects = props.items.filter((item) => item.kind === "project");

  return (
    <div
      className={clsx(
        variant === "popover" && "max-h-[min(60vh,24rem)] overflow-auto p-2",
        variant === "panel" && "grid gap-4",
      )}
    >
      {quizzes.length > 0 ? (
        <ActivitySection title="Quizzes" variant={variant}>
          {quizzes.map((item) => (
            <ActivityRow
              key={item.id}
              item={item}
              variant={variant}
              active={props.activeQuizId === item.id}
              onOpen={() => props.onOpenQuiz(item.id)}
            />
          ))}
        </ActivitySection>
      ) : null}

      {projects.length > 0 ? (
        <ActivitySection
          title="Projects"
          variant={variant}
          className={quizzes.length > 0 && variant === "popover" ? "mt-3" : undefined}
        >
          {projects.map((item) => (
            <ActivityRow
              key={item.id}
              item={item}
              variant={variant}
              active={props.activeProjectId === item.id}
              onOpen={() => props.onOpenProject(item.id)}
            />
          ))}
        </ActivitySection>
      ) : null}
    </div>
  );
}

function ActivitySection(props: {
  title: string;
  className?: string;
  variant: "popover" | "panel";
  children: ReactNode;
}) {
  return (
    <section className={props.className}>
      <h3
        className={clsx(
          "m-0 font-semibold uppercase tracking-wide text-text1",
          props.variant === "popover" ? "px-2 pb-1 text-meta" : "mb-2 text-meta",
        )}
      >
        {props.title}
      </h3>
      <ul
        className={clsx("m-0 grid p-0", props.variant === "popover" ? "gap-1.5" : "gap-2")}
        role="list"
      >
        {props.children}
      </ul>
    </section>
  );
}

function ActivityRow(props: {
  item: LessonActivityItem;
  active: boolean;
  onOpen: () => void;
  variant: "popover" | "panel";
}) {
  const { item } = props;

  return (
    <li className="list-none" role="listitem">
      <button
        type="button"
        onClick={props.onOpen}
        className={clsx(
          "flex w-full items-center gap-3 rounded-panel border text-left transition",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
          props.variant === "popover" ? "px-3 py-2.5" : "px-3 py-3 shadow-glass1",
          props.active
            ? "border-accent0/50 bg-surfaceAccent"
            : "border-border0 bg-surfacePanel",
        )}
      >
        <span
          className={clsx(
            "flex shrink-0 items-center justify-center rounded-panel border",
            props.variant === "panel" ? "h-10 w-10" : "h-9 w-9",
            item.done
              ? "border-successBorder bg-successFill text-successIcon"
              : "border-border0 bg-surfaceControl text-text1",
          )}
        >
          {item.done ? (
            <Icon icon={CheckCircle2} size={18} />
          ) : item.kind === "quiz" ? (
            <Icon icon={HelpCircle} size={18} />
          ) : (
            <Icon icon={FileCode} size={18} />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={clsx(
              "block font-medium text-text0",
              props.variant === "panel" ? "text-body leading-snug" : "truncate text-body",
            )}
          >
            {item.title}
          </span>
          <span className="mt-0.5 block text-meta text-text1">
            {item.kind === "quiz" ? "Quiz" : "Project"} · {item.statusLabel}
          </span>
        </span>

        <Icon icon={ChevronRight} size={16} className="shrink-0 text-text1" />
      </button>
    </li>
  );
}
