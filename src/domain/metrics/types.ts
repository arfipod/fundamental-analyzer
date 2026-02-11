export type ScoreGrade = 'excellent' | 'good' | 'average' | 'poor';

export type MetricSignal = 'bull' | 'neutral' | 'bear' | 'info';

export interface MetricItem {
  name: string;
  signal: MetricSignal;
}
