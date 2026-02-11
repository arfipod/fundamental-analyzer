// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAnalyzer } from './useAnalyzer';

describe('useAnalyzer', () => {
  it('returns validation error on short input', () => {
    const { result } = renderHook(() => useAnalyzer());
    act(() => result.current.analyze('short', false, '451020', 'es'));
    expect(result.current.error).toContain('demasiado cortos');
  });

  it('creates dashboard VM for valid fixture-like input', () => {
    const sample = `AAPL – Apple Inc\nIncome Statement\n| Income Statement | TIKR.com | 2022 | 2023 |\n| Revenues | 100 | 120 |\n| % Gross Margins | 35 | 40 |\n| % Operating Margins | 15 | 22 |\nCash Flow Statement\n| Cash Flow Statement | TIKR.com | 2022 | 2023 |\n| % Free Cash Flow Margins | 8 | 12 |`;
    const { result } = renderHook(() => useAnalyzer());

    act(() => result.current.analyze(sample.repeat(2), true, '451020', 'en'));

    expect(result.current.hasDashboard).toBe(true);
    expect(result.current.dashboardVm?.metadata.ticker).toBe('AAPL');
  });
});
