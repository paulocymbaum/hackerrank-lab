import { useState, type MouseEvent, type PointerEvent } from "react";
import { FolderPlus, ListChecks, MessageCircleQuestion, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  buildGenerateLessonPrompt,
  buildLessonProjectPrompt,
  buildLessonQuizPrompt,
  buildLessonSocraticPrompt,
  type ContentMapSkillPromptContext,
} from "../../../application/content-map/contentMapSkillPrompts";
import type { ContentGraphNode } from "../../../domain/types/contentGraph";
import { Icon } from "../../design-system";
import { copyToClipboard } from "../../shared/utils/copyToClipboard";

type SkillAction = {
  id: string;
  icon: LucideIcon;
  tooltip: string;
  ariaLabel: string;
  build: (ctx: ContentMapSkillPromptContext) => string;
};

const EXISTING_LESSON_ACTIONS: SkillAction[] = [
  {
    id: "socratic",
    icon: MessageCircleQuestion,
    tooltip: "Ask a Socratic question about this topic (teacher-socratic)",
    ariaLabel: "Copy teacher-socratic prompt",
    build: buildLessonSocraticPrompt,
  },
  {
    id: "quiz",
    icon: ListChecks,
    tooltip: "Create a new quiz for this lesson (create-course-quiz)",
    ariaLabel: "Copy create-course-quiz prompt",
    build: buildLessonQuizPrompt,
  },
  {
    id: "project",
    icon: FolderPlus,
    tooltip: "Create a new PBL project for this lesson (create-course-project)",
    ariaLabel: "Copy create-course-project prompt",
    build: buildLessonProjectPrompt,
  },
];

const PLANNED_LESSON_ACTIONS: SkillAction[] = [
  {
    id: "generate",
    icon: Sparkles,
    tooltip: "Generate this planned lesson (generate-lesson-teacher)",
    ariaLabel: "Copy generate-lesson-teacher prompt",
    build: buildGenerateLessonPrompt,
  },
];

function stopEvent(event: MouseEvent | PointerEvent) {
  event.preventDefault();
  event.stopPropagation();
}

function SkillActionButton(props: { action: SkillAction; context: ContentMapSkillPromptContext }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopy = async (event: MouseEvent) => {
    stopEvent(event);
    setCopyError(false);
    const ok = await copyToClipboard(props.action.build(props.context));
    if (!ok) {
      setCopyError(true);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex h-7 w-7 items-center justify-center rounded-panel border border-border0 bg-surfaceControl text-text1 transition hover:bg-surfacePanel hover:text-accent0"
        title={props.action.tooltip}
        aria-label={props.action.ariaLabel}
        onPointerDown={stopEvent}
        onClick={(event) => void handleCopy(event)}
      >
        <Icon icon={props.action.icon} size={14} />
      </button>
      {copied ? (
        <span className="absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 whitespace-nowrap rounded-panel border border-successBorder bg-successFill px-2 py-0.5 text-meta text-successText">
          Copied
        </span>
      ) : null}
      {copyError ? (
        <span className="absolute left-1/2 top-full z-20 mt-1 max-w-[10rem] -translate-x-1/2 rounded-panel border border-dangerBorder bg-dangerFill px-2 py-0.5 text-meta text-dangerText">
          Copy failed
        </span>
      ) : null}
    </div>
  );
}

export function MindMapLeafSkillActions(props: {
  node: ContentGraphNode;
  courseSlug: string;
}) {
  if (props.node.kind !== "lesson") return null;

  const context: ContentMapSkillPromptContext = {
    courseSlug: props.courseSlug,
    graphIndex: props.node.graphIndex ?? "",
    label: props.node.label,
    catalogRef: props.node.catalogRef,
  };

  const actions =
    props.node.status === "exists" && props.node.catalogRef
      ? EXISTING_LESSON_ACTIONS
      : PLANNED_LESSON_ACTIONS;

  return (
    <div className="flex flex-wrap items-center gap-1" onClick={(event) => event.stopPropagation()}>
      {actions.map((action) => (
        <SkillActionButton key={action.id} action={action} context={context} />
      ))}
    </div>
  );
}
