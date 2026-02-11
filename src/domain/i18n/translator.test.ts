import { describe, expect, it } from 'vitest';
import { translate } from './translator';

describe('translate', () => {
  it('returns key as fallback when no fallback provided', () => {
    expect(translate('es', 'analyze')).toBe('Analizar financieros');
  });
});
