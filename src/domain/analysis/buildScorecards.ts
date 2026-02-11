import type { CategoryResult, ScorecardResult } from '../types/analysis';

export function buildScorecards(categories: CategoryResult[]): ScorecardResult[] {
  return categories.map((category) => ({
    id: category.id,
    title: category.id[0].toUpperCase() + category.id.slice(1),
    grade: category.grade,
    summary: `${Math.round(category.score * 100)} / 100 health score`
  }));
}
