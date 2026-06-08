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
