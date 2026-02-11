import type { CategoryId, CategoryResult, Grade, MetricScore } from '../types/analysis';

const CATEGORY_METRICS: Record<CategoryId, string[]> = {
  growth: ['revenueCagr'],
  profitability: ['grossMargin', 'operatingMargin'],
  cashflow: ['fcfMargin'],
  leverage: ['netDebtToEbitda']
};

const gradeFromScore = (score: number): Grade => {
  if (score >= 0.8) return 'A';
  if (score >= 0.6) return 'B';
  if (score >= 0.4) return 'C';
  return 'D';
};

export function buildCategoryDiagnostics(scores: MetricScore[]): CategoryResult[] {
  return (Object.keys(CATEGORY_METRICS) as CategoryId[]).map((categoryId) => {
    const drivers = scores.filter((score) => CATEGORY_METRICS[categoryId].includes(score.metricId));
    const points = drivers.reduce((sum, driver) => sum + (driver.signal === 'bull' ? 1 : driver.signal === 'neutral' ? 0.6 : 0.2), 0);
    const normalized = drivers.length > 0 ? points / drivers.length : 0;
    return {
      id: categoryId,
      score: normalized,
      grade: gradeFromScore(normalized),
      keyDrivers: drivers
    };
  });
}
