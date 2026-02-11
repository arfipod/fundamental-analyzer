// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../application/parse', () => ({ parseInput: vi.fn() }));
vi.mock('../../application/analyze', () => ({ runAnalysis: vi.fn() }));
vi.mock('../../application/buildScorecard', () => ({ buildScorecard: vi.fn() }));
vi.mock('../../domain/metrics/scoring', () => ({ renderDashboard: vi.fn() }));
vi.mock('../../domain/industry/data', () => ({
  GICS_INDUSTRIES: [{ code: '451020', name: 'Software', profile: 'IT – Software' }]
}));

import { parseInput } from '../../application/parse';
import { runAnalysis } from '../../application/analyze';
import { buildScorecard } from '../../application/buildScorecard';
import { renderDashboard } from '../../domain/metrics/scoring';
import { useAnalyzer } from './useAnalyzer';


const makeParsed = (sections: Record<string, { rows?: unknown[] }>) =>
  ({
    ticker: 'TST',
    company: 'Test Co',
    price: null,
    priceNum: null,
    extractDate: '',
    period: 'annual',
    sections
  }) as ReturnType<typeof parseInput>;

const makeResults = () =>
  ({
    scores: { growth: 'good' },
    sections: [],
    meta: { highConfidence: [], lowConfidence: [] }
  }) as ReturnType<typeof runAnalysis>;

describe('useAnalyzer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns validation error on short input', () => {
    const { result } = renderHook(() => useAnalyzer());
    act(() => {
      result.current.analyze('short', false, '451020', 'es');
    });
    expect(result.current.error).toContain('demasiado cortos');
  });

  it('returns parse-table error when no sections/rows', () => {
    vi.mocked(parseInput).mockReturnValue(makeParsed({}));
    const { result } = renderHook(() => useAnalyzer());
    act(() => {
      result.current.analyze('x'.repeat(120), false, '451020', 'en');
    });
    expect(result.current.error).toContain('No TIKR tables detected');
  });

  it('sets dashboard html on successful analysis', () => {
    vi.mocked(parseInput).mockReturnValue(
      makeParsed({ 'Income Statement': { rows: [{}] } })
    );
    vi.mocked(runAnalysis).mockReturnValue(makeResults());
    vi.mocked(renderDashboard).mockReturnValue('<div>dashboard</div>');
    vi.mocked(buildScorecard).mockReturnValue({ dashboardHtml: '<div>dashboard</div>' });

    const { result } = renderHook(() => useAnalyzer());
    act(() => {
      result.current.analyze('x'.repeat(120), true, '451020', 'en');
    });

    expect(result.current.hasDashboard).toBe(true);
    expect(result.current.dashboardHtml).toContain('dashboard');
  });

  it('returns catch-all error on thrown exception', () => {
    vi.mocked(parseInput).mockImplementation(() => {
      throw new Error('boom');
    });

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const { result } = renderHook(() => useAnalyzer());
    act(() => {
      result.current.analyze('x'.repeat(120), false, '451020', 'en');
    });

    expect(result.current.error).toContain('Parsing/analyzing failed');
    errorSpy.mockRestore();
  });
});
