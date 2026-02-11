// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { renderDashboard } from './scoring';

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

});
