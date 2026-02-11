export type MetricId =
  | 'revenueCagr'
  | 'grossMargin'
  | 'operatingMargin'
  | 'fcfMargin'
  | 'netDebtToEbitda';

export type Signal = 'bull' | 'neutral' | 'bear';
export type Grade = 'A' | 'B' | 'C' | 'D';
export type CategoryId = 'growth' | 'profitability' | 'cashflow' | 'leverage';

export interface MetricValue {
  id: MetricId;
  label: string;
  value: number | null;
  unit: 'percent' | 'ratio';
}

export interface MetricScore {
  metricId: MetricId;
  signal: Signal;
  grade: Grade;
  weight: number;
}

export interface CategoryResult {
  id: CategoryId;
  score: number;
  grade: Grade;
  keyDrivers: MetricScore[];
}

export interface ScorecardResult {
  id: CategoryId;
  title: string;
  grade: Grade;
  summary: string;
}
