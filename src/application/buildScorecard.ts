export type AnalyzerVm = {
  dashboardHtml: string;
};

export function buildScorecard(dashboardHtml: string): AnalyzerVm {
  return { dashboardHtml };
}
