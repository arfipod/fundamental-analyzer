import type { CategoryResult, MetricValue, ScorecardResult } from '../../domain/types/analysis';

export interface DashboardSectionVM {
  id: string;
  title: string;
  rows: Array<{ label: string; values: Array<string | number | null> }>;
}

export interface DashboardVM {
  metadata: {
    ticker: string;
    company: string;
    currency: string;
    periods: string[];
    appliedProfile: string;
  };
  cards: ScorecardResult[];
  categories: CategoryResult[];
  metrics: MetricValue[];
  sections: DashboardSectionVM[];
  industryPanel: {
    industryCode: string;
    industryName: string;
    valuation: string;
    kpis: string;
    highlightMetrics: string[];
  };
}
