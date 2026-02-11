import { INDUSTRY_PROFILES, type IndustryProfileId } from '../industry/profiles';
import type { Grade, MetricScore, MetricValue, Signal } from '../types/analysis';

const DEFAULT_THRESHOLDS = {
  revenueCagr: { bull: 12, neutral: 5, direction: 'higher-is-better' as const },
  grossMargin: { bull: 45, neutral: 30, direction: 'higher-is-better' as const },
  operatingMargin: { bull: 20, neutral: 10, direction: 'higher-is-better' as const },
  fcfMargin: { bull: 14, neutral: 5, direction: 'higher-is-better' as const },
  netDebtToEbitda: { bull: 2.5, neutral: 4, direction: 'lower-is-better' as const }
};

export function signalToGrade(signal: Signal): Grade {
  if (signal === 'bull') return 'A';
  if (signal === 'neutral') return 'B';
  return 'D';
}

export function scoreMetrics(
  metrics: MetricValue[],
  profileId: IndustryProfileId
): MetricScore[] {
  const profile = INDUSTRY_PROFILES[profileId];
  return metrics.map((metric) => {
    const threshold = profile.thresholds[metric.id] ?? DEFAULT_THRESHOLDS[metric.id];
    const direction = threshold.direction ?? 'higher-is-better';

    let signal: Signal = 'neutral';
    if (metric.value === null) {
      signal = 'bear';
    } else if (direction === 'higher-is-better') {
      signal = metric.value >= threshold.bull ? 'bull' : metric.value >= threshold.neutral ? 'neutral' : 'bear';
    } else {
      signal = metric.value <= threshold.bull ? 'bull' : metric.value <= threshold.neutral ? 'neutral' : 'bear';
    }

    return { metricId: metric.id, signal, grade: signalToGrade(signal), weight: 1 };
  });
}
