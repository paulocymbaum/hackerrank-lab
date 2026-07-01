import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import type { NodeScore } from "../../../application/selectors/contentGraphScore";
import type { ContentGraphNode } from "../../../domain/types/contentGraph";
import { formatScoreLabel } from "../../../domain/scoreProgress";
import { Icon, ProgressBar } from "../../design-system";
import { MindMapLeafSkillActions } from "./MindMapLeafSkillActions";

const LESSON_CLICK_DELAY_MS = 250;

export function MindMapNodeCard(props: {
  node: ContentGraphNode;
  courseSlug: string;
  x: number;
  y: number;
  height: number;
  collapsed: boolean;
  hasChildren: boolean;
  score: NodeScore | null;
  onToggleCollapse: () => void;
  onOpenLesson?: () => void;
  onFocus?: () => void;
}) {
  const { node } = props;
  const lessonClickTimerRef = useRef<number | null>(null);
  const isPlannedLesson = node.kind === "lesson" && node.status === "planned";
  const isExistingLesson = node.kind === "lesson" && node.status === "exists";
  const isNavigable = isExistingLesson && Boolean(node.catalogRef);
  const hasScorableActivities = Boolean(props.score && props.score.points.max > 0);
  const isExplanationOnly = isExistingLesson && props.score && props.score.points.max === 0;

  const handleLessonClick = () => {
    if (!props.onOpenLesson) return;
    if (lessonClickTimerRef.current) window.clearTimeout(lessonClickTimerRef.current);
    lessonClickTimerRef.current = window.setTimeout(() => {
      props.onOpenLesson?.();
      lessonClickTimerRef.current = null;
    }, LESSON_CLICK_DELAY_MS);
  };

  const handleDoubleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (lessonClickTimerRef.current) {
      window.clearTimeout(lessonClickTimerRef.current);
      lessonClickTimerRef.current = null;
    }
    props.onFocus?.();
  };

  return (
    <div
      className="absolute"
      style={{ left: props.x, top: props.y, width: 220 }}
      data-mindmap-node
    >
      <div
        className={clsx(
          "grid gap-2 rounded-panel border bg-surfacePanel px-3 py-2 shadow-glass1",
          node.kind === "module" && "border-accent0/40",
          node.kind === "section" && "border-border0",
          node.kind === "lesson" && isExistingLesson && "border-border0",
          isPlannedLesson && "border-dashed border-border0/80 opacity-70",
          node.kind === "root" && "border-accent0/50",
          isNavigable && "cursor-pointer hover:bg-surfaceControl/80",
        )}
        style={{ minHeight: props.height }}
        onClick={isNavigable ? handleLessonClick : undefined}
        onDoubleClick={handleDoubleClick}
        onKeyDown={
          isNavigable
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  props.onOpenLesson?.();
                }
              }
            : undefined
        }
        role={isNavigable ? "button" : undefined}
        tabIndex={isNavigable ? 0 : undefined}
      >
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {node.graphIndex ? (
                <span className="rounded-pill border border-border0 bg-surfaceControl px-1.5 py-0.5 font-mono text-meta text-accent0">
                  {node.graphIndex}
                </span>
              ) : null}
              {isExistingLesson ? (
                <span className="rounded-pill border border-successBorder/40 bg-successFill px-1.5 py-0.5 text-meta text-successText">
                  Exists
                </span>
              ) : null}
              {isPlannedLesson ? (
                <span className="text-meta text-text2">Planned</span>
              ) : null}
            </div>
            <p className="m-0 mt-1 line-clamp-2 text-meta font-medium text-text0">{node.label}</p>
          </div>

          {props.hasChildren ? (
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-panel border border-border0 bg-surfaceControl text-text1 transition hover:bg-surfacePanel"
              aria-label={props.collapsed ? "Expand branch" : "Collapse branch"}
              aria-expanded={!props.collapsed}
              onClick={(event) => {
                event.stopPropagation();
                props.onToggleCollapse();
              }}
            >
              <Icon
                icon={ChevronRight}
                size={16}
                className={clsx("transition", !props.collapsed && "rotate-90")}
              />
            </button>
          ) : null}
        </div>

        {hasScorableActivities ? (
          <div className="grid gap-1.5" onClick={(event) => event.stopPropagation()}>
            <div className="text-meta font-medium text-text0">
              {formatScoreLabel(props.score!.points.value, props.score!.points.max)}
            </div>
            {props.score!.activities.total > 0 ? (
              <ProgressBar
                value={props.score!.activities.done}
                max={props.score!.activities.total}
                size="xs"
                aria-label={`${props.score!.activities.done} of ${props.score!.activities.total} activities complete`}
              />
            ) : null}
          </div>
        ) : isExplanationOnly ? (
          <div className="text-meta text-text1" onClick={(event) => event.stopPropagation()}>
            Explanation only
          </div>
        ) : null}

        {node.kind === "lesson" ? (
          <MindMapLeafSkillActions node={node} courseSlug={props.courseSlug} />
        ) : null}
      </div>
    </div>
  );
}
