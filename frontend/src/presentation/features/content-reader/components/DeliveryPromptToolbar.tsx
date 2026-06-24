import { useState } from "react";
import { ClipboardCheck, Lightbulb } from "lucide-react";
import { Button, Icon } from "../../../design-system";
import { copyToClipboard } from "../../../shared/utils/copyToClipboard";
import {
  buildReviewCursorPrompt,
  buildSocraticCursorPrompt,
  type DeliveryPromptContext,
} from "./deliveryPrompts";
import { PROJECT_DELIVERY_PASS_SCORE } from "../../../../domain/types/projectDelivery";

const PROMPTS = {
  review: {
    icon: ClipboardCheck,
    label: "Project correction",
    tooltip: `Copy a Cursor prompt to grade your delivery against acceptance criteria (review-course-project). Passing score is above ${PROJECT_DELIVERY_PASS_SCORE}.`,
    build: buildReviewCursorPrompt,
  },
  socratic: {
    icon: Lightbulb,
    label: "Contextual explanation",
    tooltip:
      "Copy a Cursor prompt for Socratic hints on module concepts — guides you with questions, not full solutions (teacher-socratic).",
    build: buildSocraticCursorPrompt,
  },
} as const;

function DeliveryPromptButton(props: {
  kind: keyof typeof PROMPTS;
  context: DeliveryPromptContext;
}) {
  const config = PROMPTS[props.kind];
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopy = async () => {
    setCopyError(false);
    const ok = await copyToClipboard(config.build(props.context));
    if (!ok) {
      setCopyError(true);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        title={config.tooltip}
        aria-label={config.label}
        onClick={() => void handleCopy()}
        className="gap-2"
      >
        <Icon icon={config.icon} size={16} />
        <span className="hidden sm:inline">{config.label}</span>
      </Button>
      {copied ? (
        <span className="absolute left-0 top-full z-10 mt-1 whitespace-nowrap rounded-panel border border-successBorder bg-successFill px-2 py-1 text-meta text-successText">
          Copied to clipboard
        </span>
      ) : null}
      {copyError ? (
        <span className="absolute left-0 top-full z-10 mt-1 max-w-[14rem] rounded-panel border border-dangerBorder bg-dangerFill px-2 py-1 text-meta text-dangerText">
          Could not copy — select text manually.
        </span>
      ) : null}
    </div>
  );
}

export function DeliveryPromptToolbar(props: DeliveryPromptContext) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-meta text-text1">Cursor prompts:</span>
      <DeliveryPromptButton kind="socratic" context={props} />
      <DeliveryPromptButton kind="review" context={props} />
    </div>
  );
}
