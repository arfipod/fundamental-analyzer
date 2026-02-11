// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useI18n } from './useI18n';

describe('useI18n', () => {
  it('falls back to spanish by default', () => {
    localStorage.removeItem('fundamentalAnalyzerLang');
    const { result } = renderHook(() => useI18n());
    expect(result.current.lang).toBe('es');
    expect(result.current.t('analyze')).toBe('Analizar financieros');
  });

  it('persists language change', () => {
    const { result } = renderHook(() => useI18n());
    act(() => result.current.changeLanguage('en'));
    expect(localStorage.getItem('fundamentalAnalyzerLang')).toBe('en');
    expect(result.current.t('analyze')).toBe('Analyze financials');
  });
});
