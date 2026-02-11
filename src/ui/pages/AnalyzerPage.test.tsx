// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const analyzeSpy = vi.fn();

vi.mock('../hooks/useI18n', () => ({
  useI18n: () => ({
    lang: 'es',
    t: (k: string) => k,
    changeLanguage: vi.fn()
  })
}));

vi.mock('../hooks/useAnalyzer', () => ({
  useAnalyzer: () => ({
    analyze: analyzeSpy,
    dashboardHtml: '',
    hasDashboard: false,
    error: '',
    clear: vi.fn()
  })
}));

vi.mock('../../domain/industry/data', () => ({
  GICS_INDUSTRIES: [
    { code: '451020', name: 'Software', profile: 'IT – Software' },
    { code: '401010', name: 'Banks', profile: 'Financials – Banks' }
  ]
}));

vi.mock('../../domain/metrics/scoring', () => ({
  switchDashboardTab: vi.fn(),
  toggleAllSections: vi.fn(),
  toggleSection: vi.fn(),
  updateToggleSectionsButton: vi.fn()
}));

import { AnalyzerPage } from './AnalyzerPage';

describe('AnalyzerPage', () => {
  beforeEach(() => {
    analyzeSpy.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('filters industry options by search text', () => {
    render(<AnalyzerPage />);

    const search = screen.getByPlaceholderText('Buscar industria por nombre o código…');
    fireEvent.change(search, { target: { value: 'bank' } });

    const industrySelect = document.getElementById('industrySelect');
    expect(industrySelect).not.toBeNull();

    const options = within(industrySelect as HTMLElement).getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('Banks');
  });

  it('calls analyze with selected controls', () => {
    render(<AnalyzerPage />);

    fireEvent.change(screen.getByPlaceholderText('dataPlaceholder'), {
      target: { value: 'x'.repeat(130) }
    });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'analyze' }));

    expect(analyzeSpy).toHaveBeenCalledTimes(1);
    const args = analyzeSpy.mock.calls[0];
    expect(args[0]).toHaveLength(130);
    expect(args[1]).toBe(true);
    expect(args[3]).toBe('es');
  });
});
