import type { CategoryId, MetricId } from '../types/analysis';

export type IndustryProfileId = 'default' | 'software' | 'banks' | 'industrials';

export interface ThresholdRule {
  bull: number;
  neutral: number;
  direction?: 'higher-is-better' | 'lower-is-better';
}

export interface IndustryProfile {
  id: IndustryProfileId;
  label: string;
  valuation: string;
  kpis: string;
  weights: Record<CategoryId, number>;
  thresholds: Partial<Record<MetricId, ThresholdRule>>;
  focus: { highlightMetrics: MetricId[]; hideMetrics?: MetricId[] };
}

export const INDUSTRY_PROFILES: Record<IndustryProfileId, IndustryProfile> = {
  default: {
    id: 'default',
    label: 'Default',
    valuation: 'P/E · EV/EBITDA · FCF yield',
    kpis: 'Growth, margins, cash conversion, leverage',
    weights: { growth: 0.25, profitability: 0.35, cashflow: 0.25, leverage: 0.15 },
    thresholds: {},
    focus: { highlightMetrics: ['revenueCagr', 'operatingMargin', 'fcfMargin'] }
  },
  software: {
    id: 'software',
    label: 'Software / SaaS',
    valuation: 'EV/S · EV/FCF · Rule-of-40 context',
    kpis: 'ARR growth, gross margin, FCF margin',
    weights: { growth: 0.4, profitability: 0.25, cashflow: 0.25, leverage: 0.1 },
    thresholds: {
      revenueCagr: { bull: 18, neutral: 8 },
      grossMargin: { bull: 70, neutral: 58 },
      fcfMargin: { bull: 20, neutral: 8 }
    },
    focus: { highlightMetrics: ['revenueCagr', 'grossMargin', 'fcfMargin'] }
  },
  banks: {
    id: 'banks',
    label: 'Banks',
    valuation: 'P/TBV · P/B · normalized P/E',
    kpis: 'NIM, CET1, credit losses, efficiency ratio',
    weights: { growth: 0.1, profitability: 0.35, cashflow: 0.15, leverage: 0.4 },
    thresholds: {
      operatingMargin: { bull: 30, neutral: 15 },
      netDebtToEbitda: { bull: 2, neutral: 4, direction: 'lower-is-better' }
    },
    focus: { highlightMetrics: ['operatingMargin', 'netDebtToEbitda'] }
  },
  industrials: {
    id: 'industrials',
    label: 'Industrials / Manufacturing',
    valuation: 'EV/EBITDA · EV/EBIT · cycle-adjusted P/E',
    kpis: 'Backlog, operating leverage, FCF conversion',
    weights: { growth: 0.2, profitability: 0.35, cashflow: 0.25, leverage: 0.2 },
    thresholds: {
      grossMargin: { bull: 38, neutral: 26 },
      operatingMargin: { bull: 18, neutral: 10 },
      netDebtToEbitda: { bull: 2.5, neutral: 4, direction: 'lower-is-better' }
    },
    focus: { highlightMetrics: ['operatingMargin', 'fcfMargin', 'netDebtToEbitda'] }
  }
};
