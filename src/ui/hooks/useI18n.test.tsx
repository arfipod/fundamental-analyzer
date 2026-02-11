// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../domain/metrics/scoring', () => ({
  setLanguage: vi.fn()
}));

import { setLanguage } from '../../domain/metrics/scoring';
import { useI18n } from './useI18n';

const LANGUAGE_KEY = 'fundamentalAnalyzerLang';

describe('useI18n', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('defaults to spanish when storage has no english flag', () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.lang).toBe('es');
  });

  it('loads english from localStorage', () => {
    localStorage.setItem(LANGUAGE_KEY, 'en');
    const { result } = renderHook(() => useI18n());
    expect(result.current.lang).toBe('en');
  });

  it('changes language and forwards to scoring.setLanguage', () => {
    const { result } = renderHook(() => useI18n());

    act(() => {
      result.current.changeLanguage('en');
    });

    expect(result.current.lang).toBe('en');
    expect(setLanguage).toHaveBeenCalledWith('en');
  });
});
