export const TRANSLATION_KEYS = [
  'appTitle',
  'subtitle',
  'language',
  'industry',
  'analyze',
  'includeAnalystNoise',
  'dataPlaceholder',
  'collapseAll',
  'openAll',
  'newAnalysis',
  'dashboardTitle',
  'analysisTab',
  'industryTab',
  'searchIndustryPlaceholder',
  'industryContextTitle',
  'scorecardsTitle',
  'sectionsTitle',
  'appliedProfile'
] as const;

export type TranslationKey = (typeof TRANSLATION_KEYS)[number];
export type SupportedLang = 'es' | 'en';
export type TranslationDict = Record<TranslationKey, string>;
