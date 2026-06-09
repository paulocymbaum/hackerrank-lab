import { useState } from "react";
import type { ProjectDeliveryEntry, ProjectDeliveryReview } from "../../../../domain/types/projectDelivery";
import { PROJECT_DELIVERY_PASS_SCORE, passesDeliveryReview } from "../../../../domain/types/projectDelivery";
import { useProjectDelivery } from "../../../../application/hooks/useProjectDelivery";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Accordion, Button, Card, EmptyState, ErrorPanel, Icon, LoadingState, Textarea } from "../../../design-system";
import { MarkdownView } from "../../../shared/MarkdownView";
import { copyToClipboard } from "../../../shared/utils/copyToClipboard";
import {
  buildReviewCursorPrompt,
  buildSocraticCursorPrompt,
  type DeliveryPromptContext,
} from "./deliveryPrompts";

function humanizeSlug(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function parseProjectPath(rootPath: string) {
  const parts = rootPath.split("/").filter(Boolean);
  const topicSlug = parts[parts.length - 2] ?? "";
  const projectSlug = parts[parts.length - 1] ?? "";
  return {
    topicSlug,
    topicTitle: humanizeSlug(topicSlug),
    projectSlug,
  };
}

function formatDeliveryDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function deliveryPreview(content: string): string {
  const line = content.split("\n").find((part) => part.trim()) ?? content;
  return line.length > 80 ? `${line.slice(0, 80)}…` : line;
}

function DeliveryReviewBlock(props: { review: ProjectDeliveryReview }) {
  const { review } = props;
  const passed = passesDeliveryReview(review.score);

  return (
    <div
      className={
        passed
          ? "rounded-panel border border-successBorder bg-successFill p-3"
          : "rounded-panel border border-border0 bg-surfacePanel p-3"
      }
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-body font-semibold text-text0">Score: {review.score}/100</span>
        {passed ? (
          <span className="text-meta font-medium text-successText">
            Passed (above {PROJECT_DELIVERY_PASS_SCORE})
          </span>
        ) : (
          <span className="text-meta text-text1">Needs improvement (pass above {PROJECT_DELIVERY_PASS_SCORE})</span>
        )}
      </div>
      <p className="m-0 mb-2 text-meta text-text1">
        Reviewed {formatDeliveryDate(review.reviewedAt)}
      </p>
      <div className="text-body text-text0">
        <MarkdownView markdown={review.comment} />
      </div>
    </div>
  );
}

function DeliveryHistoryItem(props: { entry: ProjectDeliveryEntry; index: number; total: number }) {
  const { entry, index, total } = props;
  const order = total - index;

  return (
    <Accordion
      title={
        <div className="min-w-0">
          <p className="truncate text-body font-medium text-text0">
            {formatDeliveryDate(entry.submittedAt)}
            {entry.review ? ` · ${entry.review.score}/100` : ""}
          </p>
          <p className="truncate text-meta text-text1">
            Delivery {order} of {total}
            {order === 1 ? " (latest)" : ""}
            {" · "}
            {deliveryPreview(entry.content)}
          </p>
        </div>
      }
    >
      <div className="grid gap-3">
        {entry.review ? <DeliveryReviewBlock review={entry.review} /> : null}
        <MarkdownView markdown={entry.content} />
      </div>
    </Accordion>
  );
}

function CopyPromptBlock(props: { label: string; prompt: string }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopy = async () => {
    setCopyError(false);
    const ok = await copyToClipboard(props.prompt);
    if (!ok) {
      setCopyError(true);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-panel border border-border0 bg-surfaceControl p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-meta font-medium text-text0">{props.label}</span>
        <Button type="button" size="sm" variant="secondary" onClick={() => void handleCopy()}>
          {copied ? "Copied!" : "Copy for Cursor"}
        </Button>
      </div>
      <p className="m-0 max-h-32 overflow-y-auto whitespace-pre-wrap break-words text-meta text-text1">
        {props.prompt}
      </p>
      {copyError ? (
        <p className="m-0 mt-2 text-meta text-dangerText">Could not copy. Select the text manually.</p>
      ) : null}
    </div>
  );
}

function DeliveryHelpFloatingPanel(props: DeliveryPromptContext) {
  const [minimized, setMinimized] = useState(true);
  const moduleLabel = props.courseTitle || humanizeSlug(props.courseId);
  const reviewPrompt = buildReviewCursorPrompt(props);
  const socraticPrompt = buildSocraticCursorPrompt(props);

  if (minimized) {
    return (
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="absolute right-3 top-3 z-20 shadow-glass2"
        aria-expanded={false}
        aria-label="Show help and feedback prompts"
        onClick={() => setMinimized(false)}
      >
        <Icon icon={MessageCircleQuestion} size={16} />
        Help & feedback
      </Button>
    );
  }

  return (
    <Card
      variant="panel"
      className="absolute right-3 top-3 z-20 flex max-h-[min(420px,55vh)] w-[min(calc(100%-1.5rem),26rem)] flex-col overflow-hidden border-border0 shadow-glass2 backdrop-blur-[var(--blur-2)]"
    >
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-border0 bg-surfacePanel px-3 py-2">
        <div className="min-w-0">
          <h3 className="m-0 text-body font-medium text-text0">Help & feedback</h3>
          <p className="m-0 mt-0.5 truncate text-meta text-text1">
            {props.projectTitle} · {moduleLabel}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="shrink-0 px-2"
          aria-expanded={true}
          aria-label="Minimize help panel"
          onClick={() => setMinimized(true)}
        >
          <Icon icon={ChevronDown} size={16} />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <p className="m-0 mb-3 text-meta text-text1">
          Copy a prompt into Cursor chat. Reviews focus on the exercise, module concepts, and your{" "}
          <code className="text-text0">starter/</code> code — not the study app or delivery tooling.
          Passing score is above {PROJECT_DELIVERY_PASS_SCORE}.
        </p>
        <div className="grid gap-3">
          <CopyPromptBlock label="Grade my delivery (review-course-project)" prompt={reviewPrompt} />
          <CopyPromptBlock label="Conceptual help (teacher-socratic)" prompt={socraticPrompt} />
        </div>
      </div>
    </Card>
  );
}

export function ProjectDeliveryPanel(props: {
  courseId: string;
  courseTitle: string;
  projectTitle: string;
  projectId: string;
  rootPath: string;
  enabled: boolean;
}) {
  const { courseId, courseTitle, projectTitle, projectId, rootPath, enabled } = props;
  const { topicTitle } = parseProjectPath(rootPath);
  const { draft, setDraft, deliveries, loading, error, saving, save, canSave } =
    useProjectDelivery({ courseId, projectId, rootPath, enabled });

  if (loading) {
    return (
      <div className="p-4" style={{ maxHeight: "70vh" }}>
        <LoadingState message="Loading deliveries…" />
      </div>
    );
  }

  const reversed = [...deliveries].reverse();

  return (
    <div className="overflow-auto p-4" style={{ maxHeight: "70vh" }}>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="project-delivery-draft" className="mb-2 block text-body font-medium text-text0">
            Write your project delivery
          </label>
          <p className="mb-3 text-meta text-text1">
            Free text or markdown. Each save adds a new version to your delivery history.
          </p>
          <div className="relative">
            <Textarea
              id="project-delivery-draft"
              rows={10}
              className="min-h-[16rem] pr-4"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Describe what you built, decisions you made, trade-offs, and how to run your solution…"
            />
            <DeliveryHelpFloatingPanel
              courseId={courseId}
              courseTitle={courseTitle}
              projectTitle={projectTitle}
              projectId={projectId}
              rootPath={rootPath}
              topicTitle={topicTitle}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="primary"
            disabled={!canSave}
            onClick={() => void save()}
          >
            {saving ? "Saving…" : "Save delivery"}
          </Button>
          {error ? <p className="text-meta text-text1">{error}</p> : null}
        </div>

        {error && error !== "Saved locally; dev server unavailable for disk sync" ? (
          <ErrorPanel title="Could not load deliveries" message={error} />
        ) : null}

        <div>
          <h3 className="mb-3 text-body font-medium text-text0">
            Previous deliveries ({deliveries.length})
          </h3>
          {deliveries.length === 0 ? (
            <EmptyState
              title="No deliveries yet"
              description="Your saved versions will appear here after you click Save delivery."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {reversed.map((entry, index) => (
                <DeliveryHistoryItem
                  key={entry.id}
                  entry={entry}
                  index={index}
                  total={deliveries.length}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
