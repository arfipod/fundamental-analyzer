import { INDUSTRY_PROFILES } from './data';

export function getIndustryHeuristic(profile: string) {
  return INDUSTRY_PROFILES[profile] ?? null;
}
