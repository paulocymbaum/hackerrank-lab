import clsx from "clsx";
import { CheckCircle2, XCircle } from "lucide-react";
import type { QuizQuestion } from "../../../../domain/types/quiz";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { MarkdownView } from "../../../shared/MarkdownView";
import { Card, Icon } from "../../../design-system";

type OptionVisualState = "default" | "selected" | "correct" | "incorrect" | "muted";

function getOptionState(args: {
  isChecked: boolean;
  isSelected: boolean;
  isCorrectOption: boolean;
}): OptionVisualState {
  const { isChecked, isSelected, isCorrectOption } = args;
  if (!isChecked) return isSelected ? "selected" : "default";
  if (isCorrectOption) return "correct";
  if (isSelected && !isCorrectOption) return "incorrect";
  return "muted";
}

const OPTION_STYLES: Record<OptionVisualState, string> = {
  default:
    "border-border0 bg-surfacePanel text-text0 hover:brightness-[1.03]",
  selected:
    "border-accent0/50 bg-surfaceControl text-text0 shadow-glass1",
  correct:
    "border-successBorder bg-successFill text-text0 ring-1 ring-successBorder/30",
  incorrect:
    "border-dangerBorder bg-dangerFill text-text0 ring-1 ring-dangerBorder/30",
  muted: "border-border0 bg-surfaceMuted text-text1 opacity-75",
};

export function QuizQuestionView(props: {
  question: QuizQuestion;
  questionNumber: number;
  selectedOptionId: string | undefined;
  isChecked: boolean;
  onSelect: (optionId: string) => void;
}) {
  const { t } = useTranslation();
  const { question, selectedOptionId, isChecked } = props;
  const isCorrect = selectedOptionId === question.correctOptionId;

  return (
    <Card variant="panel" className="grid gap-4 p-4">
      <div className="text-meta font-semibold text-text1">
        {t("quiz.questionNumber", { number: props.questionNumber })}
      </div>
      <MarkdownView markdown={question.prompt} />

      <ul className="m-0 grid gap-2 p-0" role="listbox" aria-label={t("quiz.answerOptions")}>
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrectOption = option.id === question.correctOptionId;
          const state = getOptionState({ isChecked, isSelected, isCorrectOption });

          return (
            <li key={option.id} className="list-none" role="presentation">
              <button
                type="button"
                disabled={isChecked}
                onClick={() => props.onSelect(option.id)}
                className={clsx(
                  "flex min-h-11 w-full items-start gap-3 rounded-panel border px-3 py-3 text-left transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
                  OPTION_STYLES[state],
                )}
                aria-pressed={isSelected}
                role="option"
                aria-selected={isSelected}
              >
                <span
                  className={clsx(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill border font-mono text-meta uppercase",
                    state === "correct" &&
                      "border-successBorder bg-successFill text-successText",
                    state === "incorrect" &&
                      "border-dangerBorder bg-dangerFill text-dangerText",
                    state === "selected" && "border-accent0/40 bg-glassTint text-text0",
                    (state === "default" || state === "muted") &&
                      "border-border0 bg-surfaceControl text-text1",
                  )}
                >
                  {state === "correct" ? (
                    <Icon icon={CheckCircle2} size={14} className="text-successIcon" />
                  ) : state === "incorrect" ? (
                    <Icon icon={XCircle} size={14} className="text-dangerIcon" />
                  ) : (
                    option.id
                  )}
                </span>
                <span className="text-body">{option.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {isChecked && question.explanation ? (
        <div
          className={clsx(
            "rounded-panel border p-3",
            isCorrect
              ? "border-successBorder bg-successFill"
              : "border-dangerBorder bg-dangerFill",
          )}
          role="status"
        >
          <div
            className={clsx(
              "mb-2 flex items-center gap-2 text-meta font-semibold",
              isCorrect ? "text-successText" : "text-dangerText",
            )}
          >
            <Icon
              icon={isCorrect ? CheckCircle2 : XCircle}
              size={16}
              className={isCorrect ? "text-successIcon" : "text-dangerIcon"}
            />
            <span>{isCorrect ? t("quiz.correct") : t("quiz.incorrect")}</span>
          </div>
          <MarkdownView markdown={question.explanation} />
        </div>
      ) : null}
    </Card>
  );
}
