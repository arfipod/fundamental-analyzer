import { describe, expect, it } from 'vitest';
import { GICS_INDUSTRIES } from './gics';
import { INDUSTRY_PROFILES } from './profiles';

describe('GICS industry coverage', () => {
  it('keeps expected 74 industries and unique codes', () => {
    expect(GICS_INDUSTRIES).toHaveLength(74);
    const uniqueCodes = new Set(GICS_INDUSTRIES.map((industry) => industry.code));
    expect(uniqueCodes.size).toBe(74);
  });

  it('maps every industry to an existing actionable profile', () => {
    for (const industry of GICS_INDUSTRIES) {
      expect(INDUSTRY_PROFILES[industry.profileId]).toBeDefined();
    }
  });
});
