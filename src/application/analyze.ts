import { buildCategoryDiagnostics } from '../domain/analysis/buildCategoryDiagnostics';
import { buildScorecards } from '../domain/analysis/buildScorecards';
import { computeMetrics } from '../domain/analysis/computeMetrics';
import { scoreMetrics } from '../domain/analysis/scoreMetrics';
import { GICS_INDUSTRIES } from '../domain/industry/gics';
import { INDUSTRY_PROFILES, type IndustryProfileId } from '../domain/industry/profiles';
import type { ParsedDocument } from '../domain/types/financial';
import type { DashboardVM } from './viewmodels/dashboardVM';

export interface AnalyzeOptions {
  industryCode: string;
}

export function analyze(rawParsed: ParsedDocument, options: AnalyzeOptions): DashboardVM {
  const industry = GICS_INDUSTRIES.find((entry) => entry.code === options.industryCode) ?? GICS_INDUSTRIES[0];
  const profileId = industry?.profileId ?? ('default' as IndustryProfileId);
  const profile = INDUSTRY_PROFILES[profileId];

  const metrics = computeMetrics(rawParsed);
  const metricScores = scoreMetrics(metrics, profileId);
  const categories = buildCategoryDiagnostics(metricScores).sort(
    (a, b) => profile.weights[b.id] - profile.weights[a.id]
  );
  const cards = buildScorecards(categories);

  return {
    metadata: {
      ticker: rawParsed.ticker,
      company: rawParsed.company,
      currency: rawParsed.currency,
      periods: rawParsed.periods.map((period) => period.label),
      appliedProfile: profile.label
    },
    cards,
    categories,
    metrics,
    sections: rawParsed.sections.map((section, index) => ({
      id: `${section.section}-${index}`,
      title: section.table.name,
      rows: section.table.rows.map((row) => ({
        label: row.name,
        values: row.cells.map((cell) => cell.value)
      }))
    })),
    industryPanel: {
      industryCode: industry?.code ?? options.industryCode,
      industryName: industry?.name ?? 'Unknown',
      valuation: profile.valuation,
      kpis: profile.kpis,
      highlightMetrics: profile.focus.highlightMetrics
    }
  };
}


export const runAnalysis = analyze;
