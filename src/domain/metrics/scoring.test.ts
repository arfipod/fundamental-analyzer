// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { renderDashboard, analyze, setLanguage } from './scoring';

type MetricItem = {
  name?: string;
  values?: {
    fullValues?: Array<number | null>;
  };
};

type ResultSection = {
  id?: string;
  items: MetricItem[];
};

function makeResults(itemOverrides: Record<string, unknown>) {
  return {
    overall: 'good',
    overallScore: 3,
    scores: {},
    totalMetrics: 1,
    sections: [
      {
        id: 'test',
        icon: '🧪',
        title: 'Test section',
        grade: 'good',
        items: [
          {
            name: 'Test metric',
            detail: 'Detail',
            confidence: 0.8,
            signal: 'neutral',
            signalText: 'Neutral',
            values: [1, 2, 3],
            labels: ['2021', '2022', '2023'],
            ...itemOverrides
          }
        ]
      }
    ]
  };
}

describe('renderDashboard trend bars', () => {
  it('renders trend bar even when some temporalities are missing', () => {
    const html = renderDashboard(
      { company: 'Acme Corp' },
      makeResults({ values: [12, null, 20], labels: ['2021', '2022', '2023'] })
    );

    const trendBarCount = (html.match(/class="trend-bar"/g) || []).length;
    const missingBarCount = (html.match(/bar-missing/g) || []).length;

    expect(trendBarCount).toBe(1);
    expect(missingBarCount).toBe(1);
    expect(html).toContain('2021: 12.00');
    expect(html).toContain('2023: 20.00');
    expect(html).not.toContain('data-i18n-point');
  });

  it('fills gaps with missing bars when labels include periods without values', () => {
    const html = renderDashboard(
      { company: 'Acme Corp' },
      makeResults({ values: [15], labels: ['2021', '2022', '2023'] })
    );

    const totalBars = (html.match(/class="bar /g) || []).length;
    const missingBarCount = (html.match(/bar-missing/g) || []).length;

    expect(totalBars).toBe(3);
    expect(missingBarCount).toBe(2);
    expect(html).toContain('2021: 15.00');
    expect(html).toContain('aria-label="2021: 15.00"');
  });
  it('uses full period metadata when available to keep missing temporal gaps', () => {
    const values = [10, 20] as number[] & {
      fullValues?: Array<number | null>;
      fullLabels?: string[];
    };
    values.fullValues = [10, null, 20];
    values.fullLabels = ['2021', '2022', '2023'];

    const html = renderDashboard(
      { company: 'Acme Corp' },
      makeResults({ values, labels: ['legacy-1', 'legacy-2'] })
    );

    const totalBars = (html.match(/class="bar /g) || []).length;
    const missingBarCount = (html.match(/bar-missing/g) || []).length;

    expect(totalBars).toBe(3);
    expect(missingBarCount).toBe(1);
    expect(html).toContain('2021: 10.00');
    expect(html).toContain('2023: 20.00');
  });



  it('exposes period and value in native tooltip attributes for each rendered bar', () => {
    const html = renderDashboard(
      { company: 'Acme Corp' },
      makeResults({ values: [12.5, 15], labels: ['31/12/23', '31/12/24'] })
    );

    document.body.innerHTML = html;

    const bars = Array.from(document.querySelectorAll('.trend-bar .bar'));
    expect(bars).toHaveLength(2);

    bars.forEach((bar) => {
      const title = bar.getAttribute('title');
      const ariaLabel = bar.getAttribute('aria-label');
      expect(title).toBeTruthy();
      expect(title).toMatch(/^.+: -?\d+\.\d{2}$/);
      expect(ariaLabel).toBe(title);
    });

    expect(document.body.textContent).not.toContain('Sin datos');
  });

  it('keeps operating leverage trend bars when intermediate periods are missing', () => {
    setLanguage('en');
    const dates = ['2020', '2021', '2022', '2023'];
    const data = {
      company: 'Acme Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [
            {
              label: '% Gross Margins',
              values: ['40%', '', '43%', '45%'],
              dates
            },
            {
              label: '% Operating Margins',
              values: ['30%', '31%', '', '33%'],
              dates
            }
          ]
        }
      }
    };

    const results = analyze(data, 'default', {
      includeAnalystNoise: false
    }) as { sections: ResultSection[] };
    const margins = results.sections.find((s) => s.id === 'margins');
    const opLeverage = margins?.items.find(
      (item) => item.name === 'Operating Leverage'
    );

    expect(opLeverage).toBeTruthy();
    if (!opLeverage) throw new Error('Operating Leverage metric not found');
    expect(opLeverage.values?.fullValues).toEqual([30, 31, null, 33]);

    const html = renderDashboard(data, results, null);
    expect(html).toMatch(/Operating Leverage[\s\S]*?class="trend-bar"/);
    expect(html).toMatch(/Operating Leverage[\s\S]*?bar-missing/);
  });

});
