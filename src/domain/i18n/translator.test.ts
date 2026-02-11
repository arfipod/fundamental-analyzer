import { describe, expect, it } from 'vitest';
import { translate } from './translator';

describe('translate', () => {
  it('falls back to english when key is missing in selected language', () => {
    expect(translate('es', 'non-existing-key', 'fallback')).toBe('fallback');
  });
});
