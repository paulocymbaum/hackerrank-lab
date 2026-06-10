import clsx from "clsx";
import {
  BookOpenText,
  CheckCircle2,
  ChevronDown,
  FileCode,
  FileText,
  HelpCircle,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { Course, Lesson, Module, Project } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import {
  getProjectsForLesson,
  getQuizzesForLesson,
} from "../../../../application/selectors/catalogSelectors";
import {
  getLessonDisplayIndex,
  getModuleDisplayIndex,
  groupLessonsBySection,
} from "../../../../application/selectors/lessonDisplay";
import {
  buildLessonActivityItems,
  type LessonActivityItem,
} from "../../../../application/selectors/lessonProgress";
import { computeProgressPercent } from "../../../../domain/scoreProgress";
import { quizProgressKey } from "../../../../domain/types/quiz";
import { useProjectDeliveryStore } from "../../../../application/stores/projectDeliveryStore";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useQuizProgressStore } from "../../../../application/stores/quizProgressStore";
import { Button, Icon } from "../../../design-system";
import { LastSubmissionScoreBar } from "../../../shared/score";
import { LessonCardProgress } from "../../lesson-workspace/components/LessonProgressFooter";
import { ModulePanelHeader } from "./ModulePanelHeader";

export function ModuleContentsDrawer(props: {
  course: Course;
  module: Module;
  courseId: string;
  moduleId: string;
  onOpenLesson: (lessonId: string) => void;
  onOpenLessonQuiz: (lessonId: string, quizId: string) => void;
  onOpenLessonProject: (lessonId: string, projectId: string) => void;
  onOpenModuleQuiz: (quizId: string) => void;
  onOpenModuleContext: () => void;
}) {
  const { lessonId: activeLessonId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const activeQuizId = searchParams.get("quiz");
  const activeProjectId = searchParams.get("project");
  const drawerMode = searchParams.get("drawer");

  const [mobileOpen, setMobileOpen] = useState(false);

  const quizByKey = useQuizProgressStore((s) => s.byKey);
  useProjectProgressStore((s) => s.byKey);
  useProjectDeliveryStore((s) => s.deliveriesByKey);

  const lessonSections = useMemo(
    () => groupLessonsBySection(props.module.lessons),
    [props.module.lessons],
  );

  const moduleQuizzes = props.module.quizzes.filter((q) => !q.lessonId);
  const moduleIndex = getModuleDisplayIndex(props.module);
  const isModuleContextActive = !activeLessonId && !activeQuizId && !activeProjectId && !drawerMode;

  useEffect(() => {
    setMobileOpen(false);
  }, [activeLessonId, activeQuizId, activeProjectId, drawerMode]);

  const nav = (
    <nav className="flex min-h-0 flex-1 flex-col" aria-label="Module contents">
      <ModulePanelHeader
        meta="Contents"
        indexLabel={moduleIndex}
        title="Module Context"
        subtitle={props.module.title}
        icon={FileText}
        active={isModuleContextActive}
        onClick={props.onOpenModuleContext}
      />

      <div className="min-h-0 flex-1 overflow-auto p-2">
        {lessonSections.map((section) => (
          <SectionAccordion
            key={section.sectionKey}
            sectionKey={section.sectionKey}
            sectionLabel={section.sectionLabel}
            defaultOpen={
              section.lessons.some((lesson) => lesson.id === activeLessonId) ||
              section.sectionKey === lessonSections[0]?.sectionKey
            }
          >
            {section.lessons.map((lesson) => {
              const quizzes = getQuizzesForLesson(props.course, props.moduleId, lesson.id);
              const projects = getProjectsForLesson(props.course, props.moduleId, lesson.id);
              const items = buildLessonActivityItems({
                courseId: props.courseId,
                lessonId: lesson.id,
                quizzes,
                projects,
              });

              return (
                <LessonAccordion
                  key={lesson.id}
                  lesson={lesson}
                  items={items}
                  isActiveLesson={lesson.id === activeLessonId}
                  activeQuizId={lesson.id === activeLessonId ? activeQuizId : null}
                  activeProjectId={lesson.id === activeLessonId ? activeProjectId : null}
                  defaultOpen={lesson.id === activeLessonId}
                  onOpenLesson={() => props.onOpenLesson(lesson.id)}
                  onOpenQuiz={(quizId) => props.onOpenLessonQuiz(lesson.id, quizId)}
                  onOpenProject={(projectId) =>
                    props.onOpenLessonProject(lesson.id, projectId)
                  }
                />
              );
            })}
          </SectionAccordion>
        ))}

        {moduleQuizzes.length > 0 ? (
          <ModuleQuizzesAccordion
            courseId={props.courseId}
            quizzes={moduleQuizzes}
            quizByKey={quizByKey}
            activeQuizId={activeQuizId}
            onOpenQuiz={props.onOpenModuleQuiz}
          />
        ) : null}
      </div>
    </nav>
  );

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2 lg:mb-0 lg:hidden">
        <p className="m-0 text-meta font-semibold text-text1">Module contents</p>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setMobileOpen((open) => !open)}
          title={mobileOpen ? "Hide contents" : "Show contents"}
        >
          <Icon icon={mobileOpen ? PanelLeftClose : PanelLeftOpen} />
          {mobileOpen ? "Hide" : "Contents"}
        </Button>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        className={clsx(
          "flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-border0 bg-surfacePanel",
          "lg:relative lg:z-auto lg:w-80 lg:self-stretch lg:rounded-l-panel lg:border lg:border-r-0",
          mobileOpen
            ? "fixed inset-y-0 left-0 z-50 max-w-[min(100vw-1rem,20rem)] rounded-panel border shadow-glass2 lg:static lg:shadow-none"
            : "hidden lg:flex",
        )}
      >
        {nav}
      </aside>
    </>
  );
}

function SectionAccordion(props: {
  sectionKey: string;
  sectionLabel: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="group mb-1" open={props.defaultOpen}>
      <summary
        className={clsx(
          "flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-panel px-2 py-2",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
        )}
      >
        <Icon icon={Layers} size={14} className="shrink-0 text-text1" />
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-meta font-semibold text-accent0">{props.sectionKey}</span>
          <span className="block truncate text-meta text-text1">{props.sectionLabel}</span>
        </span>
        <Icon icon={ChevronDown} size={14} className="shrink-0 text-text1 transition group-open:rotate-180" />
      </summary>
      <div className="ml-2 grid gap-0.5 border-l border-border0 py-1 pl-2">{props.children}</div>
    </details>
  );
}

function LessonAccordion(props: {
  lesson: Lesson;
  items: LessonActivityItem[];
  isActiveLesson: boolean;
  activeQuizId: string | null;
  activeProjectId: string | null;
  defaultOpen?: boolean;
  onOpenLesson: () => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenProject: (projectId: string) => void;
}) {
  const displayIndex = getLessonDisplayIndex(props.lesson);

  return (
    <details className="group" open={props.defaultOpen}>
      <summary
        className={clsx(
          "flex cursor-pointer list-none flex-col gap-1.5 rounded-panel px-2 py-1.5",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
          props.isActiveLesson && "bg-surfaceAccent",
        )}
      >
        <div className="flex min-h-7 items-center gap-2">
          <span className="w-12 shrink-0 font-mono text-meta text-text2">{displayIndex}</span>
          <span className="min-w-0 flex-1 truncate text-meta font-medium text-text0">
            {props.lesson.title}
          </span>
          <Icon
            icon={ChevronDown}
            size={14}
            className="shrink-0 text-text1 transition group-open:rotate-180"
          />
        </div>
        <LessonCardProgress items={props.items} />
      </summary>

      <div className="grid gap-0.5 py-1 pl-3">
        <NavRow
          icon={BookOpenText}
          label="Explanation"
          sublabel="Lesson README"
          active={props.isActiveLesson && !props.activeQuizId && !props.activeProjectId}
          onClick={props.onOpenLesson}
        />

        {props.items.map((item) => (
          <NavRow
            key={`${item.kind}-${item.id}`}
            icon={item.done ? CheckCircle2 : item.kind === "quiz" ? HelpCircle : FileCode}
            label={item.kind === "quiz" ? "Quiz" : "Project"}
            sublabel={item.title}
            active={
              props.isActiveLesson &&
              (item.kind === "quiz"
                ? props.activeQuizId === item.id
                : props.activeProjectId === item.id)
            }
            done={item.done}
            lastSubmissionPercent={item.lastSubmissionPercent}
            onClick={() => {
              if (item.kind === "quiz") props.onOpenQuiz(item.id);
              else props.onOpenProject(item.id);
            }}
          />
        ))}
      </div>
    </details>
  );
}

function ModuleQuizzesAccordion(props: {
  courseId: string;
  quizzes: Quiz[];
  quizByKey: Record<string, { lastAttempt?: { score: number; total: number } }>;
  activeQuizId: string | null;
  onOpenQuiz: (quizId: string) => void;
}) {
  return (
    <details className="group mt-2 border-t border-border0 pt-2" open>
      <summary
        className={clsx(
          "flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-panel px-2 py-2",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
        )}
      >
        <Icon icon={HelpCircle} size={14} className="shrink-0 text-text1" />
        <span className="min-w-0 flex-1 text-meta font-semibold text-text0">Module quizzes</span>
        <Icon icon={ChevronDown} size={14} className="shrink-0 text-text1 transition group-open:rotate-180" />
      </summary>
      <div className="grid gap-0.5 py-1 pl-2">
        {props.quizzes.map((quiz) => {
          const lastAttempt = props.quizByKey[quizProgressKey(props.courseId, quiz.id, quiz.lessonId)]
            ?.lastAttempt;
          const lastSubmissionPercent = lastAttempt
            ? computeProgressPercent(lastAttempt.score, lastAttempt.total)
            : undefined;

          return (
            <NavRow
              key={quiz.id}
              icon={HelpCircle}
              label="Quiz"
              sublabel={quiz.title}
              active={props.activeQuizId === quiz.id}
              lastSubmissionPercent={lastSubmissionPercent}
              onClick={() => props.onOpenQuiz(quiz.id)}
            />
          );
        })}
      </div>
    </details>
  );
}

function NavRow(props: {
  icon: typeof BookOpenText;
  label: string;
  sublabel: string;
  active?: boolean;
  done?: boolean;
  lastSubmissionPercent?: number;
  onClick: () => void;
}) {
  return (
    <div className="grid gap-1.5">
      <button
        type="button"
        onClick={props.onClick}
        className={clsx(
          "flex w-full items-center gap-2 rounded-panel px-2 py-1.5 text-left transition",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
          props.active ? "border border-accent0/40 bg-surfaceAccent" : "border border-transparent",
        )}
      >
        <span
          className={clsx(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-panel border",
            props.done
              ? "border-successBorder bg-successFill text-successIcon"
              : "border-border0 bg-surfaceControl text-text1",
          )}
        >
          <Icon icon={props.icon} size={14} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-meta font-medium text-text0">{props.label}</span>
          <span className="block truncate text-meta text-text2">{props.sublabel}</span>
        </span>
      </button>
      {props.lastSubmissionPercent !== undefined ? (
        <LastSubmissionScoreBar
          percent={props.lastSubmissionPercent}
          className="px-2 pb-1.5 pl-11"
        />
      ) : null}
    </div>
  );
}
