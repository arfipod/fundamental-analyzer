// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { renderDashboard, setCurrentLang } from './scoring';

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
          detail: 'Revenue is compounding over the observed period',
          explanation: 'FY22: 9.8 % · FY23: 11.1 % · FY24: 12.5 %',
          value: '12.5%',
          signal: 'bull',
          signalText: 'Acceleration is healthy',
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
  it('renders print action button and print tab', () => {
    setCurrentLang('es');
    const html = renderDashboard(sampleData, sampleResults, null);

    expect(html).toContain("switchDashboardTab('print')");
    expect(html).toContain('🖨️ Imprimible');
  });

  it('renders a simplified printable panel in the dashboard', () => {
    setCurrentLang('en');
    const html = renderDashboard(sampleData, sampleResults, null);

    expect(html).toContain('data-panel="print"');
    expect(html).toContain('Quick summary');
    expect(html).toContain('class="print-metric"');
    expect(html).toContain('class="print-title">Revenue Growth (CAGR)');
    expect(html).toContain('class="print-headline">Revenue is compounding over the observed period');
    expect(html).toContain('<ul class="print-bullets">');
    expect(html).toContain('<strong>Data:</strong> FY22: 9.8 % · FY23: 11.1 % · FY24: 12.5 %');
    expect(html).toContain('class="print-signal"><strong>Signal:</strong> 🟢 Positive · Acceleration is healthy');
    expect(html).toContain('Simplified print-friendly view');
  });
});
