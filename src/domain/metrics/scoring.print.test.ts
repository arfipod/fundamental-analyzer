// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  openPrintView,
  renderDashboard,
  setCurrentLang
} from './scoring';

const sampleResults = {
  overall: 'good',
  overallScore: 2.7,
  totalMetrics: 1,
  scores: { growth: 'good' },
  sections: [
    {
      id: 'growth',
      icon: '📈',
      title: 'Growth',
      grade: 'good',
      items: [
        {
          name: 'Revenue Growth (CAGR)',
          value: '12.5%',
          signal: 'bull',
          note: 'Solid growth trend'
        }
      ]
    }
  ]
};

const sampleData = {
  company: 'Acme Corp',
  ticker: 'ACME',
  price: '$100',
  period: 'FY 2024'
};

describe('printable dashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders print action button in dashboard header', () => {
    setCurrentLang('es');
    const html = renderDashboard(sampleData, sampleResults, null);
    expect(html).toContain('🖨️ Imprimir');
  });

  it('opens a simplified printable window', () => {
    setCurrentLang('en');
    renderDashboard(sampleData, sampleResults, null);

    const write = vi.fn();
    const popup = {
      document: {
        open: vi.fn(),
        write,
        close: vi.fn()
      }
    };

    vi.stubGlobal('open', vi.fn(() => popup));

    openPrintView();

    expect(write).toHaveBeenCalledTimes(1);
    expect(write.mock.calls[0][0]).toContain('Quick summary');
    expect(write.mock.calls[0][0]).toContain('Revenue Growth (CAGR)');
    expect(write.mock.calls[0][0]).toContain('🖨️ Print');
  });
});
