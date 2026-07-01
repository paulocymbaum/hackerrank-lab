import { useState } from "react";
import type { ProjectDeliveryEntry, ProjectDeliveryReview } from "../../../../domain/types/projectDelivery";
import type { ReaderEntry } from "../../../../domain/types/reader";
import { PROJECT_DELIVERY_PASS_SCORE, passesDeliveryReview } from "../../../../domain/types/projectDelivery";
import { useProjectDelivery } from "../../../../application/hooks/useProjectDelivery";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { formatDeliveryMarkdownForDisplay } from "../../../../application/usecases/formatDeliveryMarkdown";
import {
  appendStarterToDraft,
  hasProjectStarter,
} from "../../../../application/usecases/importProjectStarter";
import { canRunProjectDraft } from "../../../../application/usecases/extractStarterIndexFromDraft";
import { useProjectRun } from "../../../../application/hooks/useProjectRun";
import { getProjectSampleInput } from "../../../../application/usecases/projectSampleInput";
import { Accordion, Button, Dialog, EmptyState, ErrorPanel, LoadingState, Textarea } from "../../../design-system";
import { MarkdownView } from "../../../shared/MarkdownView";
import { DeliveryPromptToolbar } from "./DeliveryPromptToolbar";
import { ProjectRunAnswerPanel } from "./ProjectRunAnswerPanel";

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
  const projectsIdx = parts.indexOf("projects");
  const lessonSlug =
    projectsIdx > 0 ? (parts[projectsIdx - 1] ?? "") : (parts[parts.length - 2] ?? "");
  const projectSlug = parts[parts.length - 1] ?? "";
  return {
    topicSlug: lessonSlug,
    topicTitle: humanizeSlug(lessonSlug),
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
          <span className="text-meta text-text1">
            Needs improvement (pass above {PROJECT_DELIVERY_PASS_SCORE})
          </span>
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

function DeliveryHistoryItem(props: {
  entry: ProjectDeliveryEntry;
  index: number;
  total: number;
  defaultOpen?: boolean;
}) {
  const { entry, index, total, defaultOpen } = props;
  const order = total - index;
  const displayMarkdown = formatDeliveryMarkdownForDisplay(entry.content);

  return (
    <Accordion
      defaultOpen={defaultOpen}
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
        <MarkdownView markdown={displayMarkdown} />
      </div>
    </Accordion>
  );
}

export function ProjectDeliveryPanel(props: {
  courseId: string;
  courseTitle: string;
  projectTitle: string;
  projectId: string;
  rootPath: string;
  entries?: ReaderEntry[];
  enabled: boolean;
}) {
  const { courseId, courseTitle, projectTitle, projectId, rootPath, entries = [], enabled } = props;
  const { t } = useTranslation();
  const { topicTitle } = parseProjectPath(rootPath);
  const { draft, setDraft, deliveries, loading, error, saving, save, canSave } =
    useProjectDelivery({ courseId, projectId, rootPath, enabled });

  const [pasteConfirmOpen, setPasteConfirmOpen] = useState(false);
  const latestDelivery = deliveries.at(-1);
  const canPasteLatest = deliveries.length > 0;

  const canImportStarter = hasProjectStarter(entries);
  const sampleInput = getProjectSampleInput(entries);
  const showRunAnswer = hasProjectStarter(entries);
  const canRunAnswer =
    Boolean(sampleInput !== null) && canRunProjectDraft(draft, hasProjectStarter(entries));
  const { running, result, error: runError, run } = useProjectRun({
    courseId,
    rootPath,
    draft,
    sampleInput,
    enabled: enabled && canRunAnswer,
  });

  const promptContext = {
    courseId,
    courseTitle,
    projectTitle,
    projectId,
    rootPath,
    topicTitle,
  };

  if (loading) {
    return (
      <div className="p-4">
        <LoadingState message="Loading deliveries…" />
      </div>
    );
  }

  const reversed = [...deliveries].reverse();

  const handlePasteLatest = () => {
    if (!latestDelivery) return;
    setDraft(latestDelivery.content);
    setPasteConfirmOpen(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="project-delivery-draft" className="mb-2 block text-body font-medium text-text0">
            Write your project delivery
          </label>
          <p className="mb-3 text-meta text-text1">
            Free text or markdown. Each save adds a new version to your delivery history.
          </p>
          <div className="mb-3">
            <DeliveryPromptToolbar {...promptContext} />
          </div>
          <Textarea
            id="project-delivery-draft"
            rows={12}
            className="min-h-[14rem]"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Describe what you built, decisions you made, trade-offs, and how to run your solution…"
          />
          {showRunAnswer ? (
            <ProjectRunAnswerPanel
              canRun={canRunAnswer}
              running={running}
              result={result}
              error={runError}
              onRun={() => void run()}
            />
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="primary" disabled={!canSave} onClick={() => void save()}>
            {saving ? t("reader.saving") : t("reader.saveDelivery")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!canImportStarter}
            title={
              canImportStarter ? t("delivery.importStarterTooltip") : t("delivery.noStarter")
            }
            onClick={() => setDraft((current) => appendStarterToDraft(current, entries))}
          >
            {t("delivery.importStarter")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!canPasteLatest}
            title={
              canPasteLatest ? t("delivery.pasteLatestTooltip") : t("delivery.noDeliveriesToPaste")
            }
            onClick={() => setPasteConfirmOpen(true)}
          >
            {t("delivery.pasteLatest")}
          </Button>
          {error ? <p className="text-meta text-text1">{error}</p> : null}
        </div>

        <Dialog
          open={pasteConfirmOpen}
          onOpenChange={setPasteConfirmOpen}
          title={t("delivery.pasteLatestConfirmTitle")}
          description={t("delivery.pasteLatestConfirmDescription")}
          className="max-w-md"
          header={
            <div className="border-b border-border0 px-4 py-4">
              <h2 className="text-body font-semibold text-text0">
                {t("delivery.pasteLatestConfirmTitle")}
              </h2>
              <p className="mt-2 text-meta text-text1">
                {t("delivery.pasteLatestConfirmDescription")}
              </p>
            </div>
          }
        >
          <div className="flex justify-end gap-2 px-4 py-4">
            <Button type="button" variant="ghost" onClick={() => setPasteConfirmOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="button" variant="primary" onClick={handlePasteLatest}>
              {t("delivery.pasteLatestConfirmAction")}
            </Button>
          </div>
        </Dialog>

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
                  defaultOpen={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
