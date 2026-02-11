import { describe, expect, it } from 'vitest';
import { getIndustryHeuristic } from './heuristics';

describe('getIndustryHeuristic', () => {
  it('returns heuristic for known profile', () => {
    const heuristic = getIndustryHeuristic('software');
    expect(heuristic).not.toBeNull();
    expect(heuristic?.valuation).toContain('EV/');
  });

  it('returns null for unknown profile', () => {
    expect(getIndustryHeuristic('Unknown')).toBeNull();
  });
});
