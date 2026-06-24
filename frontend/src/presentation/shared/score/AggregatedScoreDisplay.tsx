import clsx from "clsx";
import type { ScoreMetric } from "../../../domain/scoreProgress";
import { formatScoreLabel } from "../../../domain/scoreProgress";
import { PROJECT_POINTS_WEIGHT } from "../../../domain/types/quizScore";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { Card, Icon, ProgressBar } from "../../design-system";
import type { LucideIcon } from "lucide-react";
import { ScoreProgressRow } from "./ScoreProgressRow";

export type AggregatedScoreMetrics = {
  total: ScoreMetric;
  quiz: ScoreMetric;
  projects: ScoreMetric;
};

export function AggregatedScoreDisplay(props: {
  metrics: AggregatedScoreMetrics;
  variant: "badge" | "compact" | "full" | "catalog";
  title?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  const { t } = useTranslation();
  const { metrics, variant } = props;
  const title = props.title ?? t("course.score");
  const hasProgress = metrics.total.max > 0;

  if (variant === "badge") {
    return (
      <AggregatedScoreBadge
        metrics={metrics}
        className={props.className}
        icon={props.icon}
      />
    );
  }

  if (variant === "catalog") {
    if (!hasProgress) return null;
    return (
      <div
        className={clsx(
          "grid min-w-[12rem] gap-2 rounded-panel border border-border0 bg-surfacePanel px-3 py-2",
          props.className,
        )}
      >
        <div className="flex flex-wrap items-center gap-2 text-meta text-text1">
          {props.icon ? <Icon icon={props.icon} size={16} className="text-accent0" /> : null}
          <span className="font-semibold text-text0">{formatScoreLabel(metrics.total.value, metrics.total.max)}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            {t("score.quizInline", { value: metrics.quiz.value })} ·{" "}
            {t("score.projectsInline", { value: metrics.projects.value })}
          </span>
        </div>
        <ProgressBar
          value={metrics.total.value}
          max={metrics.total.max}
          size="xs"
          aria-label={t("catalog.overallProgress")}
        />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Card variant="panel" className={clsx("border-border0 bg-surfacePanel px-4 py-3", props.className)}>
        <div className="grid gap-3">
          <ScoreHeader title={title} icon={props.icon} metric={metrics.total} />
          {hasProgress ? (
            <ProgressBar
              value={metrics.total.value}
              max={metrics.total.max}
              size="sm"
              aria-label={t("score.progress", { title })}
            />
          ) : null}
          <ScoreBreakdownInline metrics={metrics} />
        </div>
      </Card>
    );
  }

  return (
    <Card variant="panel" className={clsx("border-border0 bg-surfacePanel p-4", props.className)}>
      <ScoreHeader title={title} icon={props.icon} metric={metrics.total} />
      {hasProgress ? (
        <ProgressBar
          value={metrics.total.value}
          max={metrics.total.max}
          size="md"
          className="mt-3"
          aria-label={`${title} progress`}
        />
      ) : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <ScoreBreakdownItem
          label={t("course.quizBestAnswers")}
          metric={metrics.quiz}
          barSize="xs"
        />
        <ScoreBreakdownItem
          label={t("course.projectsDone", { weight: PROJECT_POINTS_WEIGHT })}
          metric={metrics.projects}
          barSize="xs"
        />
      </div>
    </Card>
  );
}

function AggregatedScoreBadge(props: {
  metrics: AggregatedScoreMetrics;
  icon?: LucideIcon;
  className?: string;
}) {
  const { t } = useTranslation();
  const { metrics } = props;
  const hasProgress = metrics.total.max > 0;

  return (
    <span
      className={clsx(
        "inline-grid min-w-[7.5rem] gap-1.5 rounded-pill border border-border0 bg-surfaceControl px-2.5 py-1.5",
        props.className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-meta font-medium text-text0">
        {props.icon ? <Icon icon={props.icon} size={14} className="shrink-0 text-accent0" /> : null}
        <span>{formatScoreLabel(metrics.total.value, hasProgress ? metrics.total.max : undefined)}</span>
      </span>
      {hasProgress ? (
        <ProgressBar
          value={metrics.total.value}
          max={metrics.total.max}
          size="xs"
          aria-label={t("course.scoreProgress")}
        />
      ) : null}
    </span>
  );
}

function ScoreHeader(props: { title: string; icon?: LucideIcon; metric: ScoreMetric }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-body font-semibold text-text0">
        {props.icon ? <Icon icon={props.icon} className="text-accent0" /> : null}
        <span>{props.title}</span>
      </div>
      <div className="text-title font-semibold text-text0">
        {formatScoreLabel(props.metric.value, props.metric.max > 0 ? props.metric.max : undefined)}
      </div>
    </div>
  );
}

function ScoreBreakdownInline(props: { metrics: AggregatedScoreMetrics }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-meta text-text1">
      <span>
        {t("score.quizLabel")}{" "}
        <span className="font-medium text-text0">
          {props.metrics.quiz.value}
          {props.metrics.quiz.max > 0 ? ` / ${props.metrics.quiz.max}` : ""}
        </span>
      </span>
      <span>
        {t("score.projectsLabel")}{" "}
        <span className="font-medium text-text0">
          {props.metrics.projects.value}
          {props.metrics.projects.max > 0 ? ` / ${props.metrics.projects.max}` : ""}
        </span>
      </span>
    </div>
  );
}

function ScoreBreakdownItem(props: {
  label: string;
  metric: ScoreMetric;
  barSize?: "xs" | "sm" | "md";
}) {
  return (
    <div className="rounded-panel border border-border0 bg-surfaceControl px-3 py-2">
      <ScoreProgressRow label={props.label} metric={props.metric} size={props.barSize ?? "xs"} />
    </div>
  );
}

export function toAggregatedScoreMetrics(input: {
  totalPoints: number;
  totalMax: number;
  quizPoints: number;
  quizMax: number;
  projectPoints: number;
  projectMax: number;
}): AggregatedScoreMetrics {
  return {
    total: { value: input.totalPoints, max: input.totalMax },
    quiz: { value: input.quizPoints, max: input.quizMax },
    projects: { value: input.projectPoints, max: input.projectMax },
  };
}
