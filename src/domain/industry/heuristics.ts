import { INDUSTRY_PROFILES } from './data';

const profiles = INDUSTRY_PROFILES as Record<string, { valuation: string; kpis: string }>;

export function getIndustryHeuristic(profile: string) {
  return profiles[profile] ?? null;
}
