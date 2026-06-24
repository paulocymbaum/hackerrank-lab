export type ScoreMetric = {
  value: number;
  max: number;
};

export function computeProgressPercent(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.round((value / max) * 100));
}

export function formatScoreLabel(value: number, max?: number): string {
  if (max !== undefined && max > 0) return `${value} / ${max} pts`;
  return `${value} pts`;
}

export function toScoreMetric(value: number, max: number): ScoreMetric {
  return { value, max };
}

export type SubmissionScoreTier = "success" | "warning" | "danger";

/** Green > 80%, yellow 50–80%, red < 50%. */
export function submissionScoreTier(percent: number): SubmissionScoreTier {
  if (percent > 80) return "success";
  if (percent >= 50) return "warning";
  return "danger";
}
