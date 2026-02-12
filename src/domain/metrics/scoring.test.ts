// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import {
  renderDashboard,
  analyze,
  setLanguage,
  onLanguageChange,
  parseTIKR
} from './scoring';

type MetricItem = {
  name?: string;
  detail?: string;
  explanation?: string;
  signal?: string;
  signalText?: string;
  values?: any;
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


  it('does not corrupt words when translating small tokens like "up" inside larger words', () => {
    setLanguage('es');
    const html = renderDashboard(
      { company: 'Acme Corp' },
      makeResults({
        detail: 'This remains supported and duplicate and supplier text.',
        explanation: 'Check supported supplier duplicate'
      })
    );

    expect(html).toContain('supported');
    expect(html).toContain('duplicate');
    expect(html).toContain('supplier');
    expect(html).not.toContain('al alza');
    expect(html).not.toContain('alzal');
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

describe('FCF Uses Summary formatting', () => {
  it('includes total FCF and per-item percentages without "% )" spacing in Spanish', () => {
    setLanguage('es');
    const dates = ['2024'];
    const data = {
      company: 'Acme Corp',
      sections: {
        'Income Statement': { dates, rows: [] },
        'Balance Sheet': { dates, rows: [] },
        Ratios: { dates, rows: [] },
        'Cash Flow': {
          dates,
          rows: [
            { label: 'Free Cash Flow', values: ['123324'], dates },
            { label: 'Share Buybacks', values: ['-97767'], dates },
            { label: 'Dividends Paid', values: ['-15486'], dates },
            { label: 'Debt Repaid', values: ['-12085'], dates },
            { label: 'Net Change in Cash', values: ['15018'], dates }
          ]
        }
      }
    };

    const results = analyze(data, 'default', {
      includeAnalystNoise: false
    }) as { sections: ResultSection[] };
    const allItems = results.sections.flatMap((section) => section.items || []);
    const fcfUses = allItems.find((item) => item.name === 'FCF Uses Summary') as
      | { explanation?: string }
      | undefined;

    expect(fcfUses).toBeTruthy();
    const html = renderDashboard(data, results, null);

    expect(html).toContain('flujo de caja libre (FCF) total 123324');
    expect(html).toContain('recompras 97767 (79.3 %)');
    expect(html).toContain('dividendos 15486 (12.6 %)');
    expect(html).toContain('amortización de deuda 12085 (9.8 %)');
    expect(html).toContain('aumento/acumulación de caja 15018 (12.2 %)');
    expect(html).not.toContain('% )');
  });
});


describe('analysis regressions for alignment and period handling', () => {

  it('marks valuation as non-interpretable when market cap or EV are invalid', () => {
    setLanguage('en');
    const dates = ['2023', '2024'];
    const data = {
      company: 'Invalid Value Corp',
      sections: {
        'Income Statement': { dates, rows: [{ label: 'Revenue', values: ['100', '110'], dates }] },
        'Balance Sheet': { dates, rows: [] },
        Ratios: { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        'Valuation Multiples': {
          dates,
          rows: [
            { label: 'Market Cap', values: ['0', '0'], dates },
            { label: 'Enterprise Value', values: ['0', '0'], dates },
            { label: 'NTM EV / Revenues', values: ['6', '7'], dates },
            { label: 'NTM Total Enterprise Value / EBITDA', values: ['12', '13'], dates },
            { label: 'EV/EBIT', values: ['18', '19'], dates }
          ]
        }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const valuation = results.sections.find((s) => s.id === 'valuation');
    const evVsMc = valuation?.items.find((i) => i.name === 'Enterprise Value vs Market Cap');
    const evRev = valuation?.items.find((i) => i.name === 'EV / Revenues (NTM)');
    const evEbitda = valuation?.items.find((i) => i.name === 'EV/EBITDA (NTM)');

    expect(evVsMc?.signalText).toContain('Invalid valuation datapoint');
    expect(evRev?.signalText).toContain('N/A due to invalid EV/MC');
    expect(evEbitda?.signalText).toContain('N/A due to invalid EV/MC');
  });

  it('adds interpretation guidance to every generated metric detail', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'Acme Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [
            { label: 'Revenue', values: ['100', '120', '145'], dates },
            { label: 'Gross Profit', values: ['40', '52', '66'], dates },
            { label: 'Operating Income', values: ['20', '27', '34'], dates },
            { label: 'Net Income', values: ['15', '21', '28'], dates },
            { label: 'EBITDA', values: ['24', '30', '37'], dates }
          ]
        },
        'Balance Sheet': {
          dates,
          rows: [
            { label: 'Cash & Equivalents', values: ['15', '17', '20'], dates },
            { label: 'Total Assets', values: ['200', '220', '250'], dates },
            { label: 'Total Debt', values: ['60', '58', '55'], dates },
            { label: 'Total Equity', values: ['70', '80', '95'], dates },
            { label: 'Current Assets', values: ['80', '88', '96'], dates },
            { label: 'Current Liabilities', values: ['55', '58', '60'], dates }
          ]
        },
        'Cash Flow': {
          dates,
          rows: [
            { label: 'Cash from Operations', values: ['18', '23', '30'], dates },
            { label: 'Capex', values: ['-4', '-5', '-6'], dates },
            { label: 'Free Cash Flow', values: ['14', '18', '24'], dates }
          ]
        },
        Ratios: { dates, rows: [] },
        'Valuation Multiples': { dates, rows: [] },
        'Consensus Estimates': { dates, rows: [] }
      }
    };

    const results = analyze(data, 'default', {
      includeAnalystNoise: false
    }) as { sections: ResultSection[] };

    const metricItems = results.sections.flatMap((section) => section.items || []);
    expect(metricItems.length).toBeGreaterThan(0);
    metricItems.forEach((item) => {
      expect(item.detail || '').toContain('Interpretation:');
    });

    const enrichedItem = metricItems.find((item) =>
      (item.detail || '').includes('What it means:')
    );
    expect(enrichedItem).toBeTruthy();
    expect(enrichedItem?.detail || '').toContain('Guide ranges:');
    expect(enrichedItem?.detail || '').toContain('Common pitfalls:');
  });
  it('aligns cross-row ratios by date instead of index when periods are missing', () => {
    setLanguage('en');
    const dates = ['2020', '2021', '2022', '2023'];
    const data = {
      company: 'Aligned Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [
            { label: 'Revenues', values: ['', '120', '140', '160'], dates },
            { label: 'Cost of Goods Sold', values: ['40', '60', '70', '80'], dates }
          ]
        },
        'Balance Sheet': { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        Ratios: { dates, rows: [] }
      }
    };

    const results = analyze(data, 'default', {
      includeAnalystNoise: false
    }) as { sections: ResultSection[] };

    const costs = results.sections.find((s) => s.id === 'costs');
    const cogsItem = costs?.items.find((item) => item.name === 'COGS as % of Revenue');

    expect(cogsItem).toBeTruthy();
    expect(cogsItem?.detail).toContain('Latest: 50.0%');
    expect(cogsItem?.detail).toContain('Δ 0.0pp');
    expect(cogsItem?.signalText).toBe('Stable');
  });

  it('excludes LTM from annual CAGR calculations in growth', () => {
    setLanguage('en');
    const dates = ['2021', '2022', '2023', 'LTM'];
    const data = {
      company: 'NoLTM Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [{ label: 'Revenues', values: ['100', '120', '140', '150'], dates }]
        },
        'Balance Sheet': { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        Ratios: { dates, rows: [] }
      }
    };

    const results = analyze(data, 'default', {
      includeAnalystNoise: false
    }) as { sections: ResultSection[] };

    const growth = results.sections.find((s) => s.id === 'growth');
    const revenueGrowth = growth?.items.find(
      (item) => item.name === 'Revenue Growth (CAGR)'
    );

    expect(revenueGrowth).toBeTruthy();
    expect(revenueGrowth?.detail).toContain('2Y CAGR');
    expect(revenueGrowth?.explanation).toContain('Revenue: 100 → 140');
  });

  it('parses finite numeric values without requiring string inputs', () => {
    setLanguage('en');
    const dates = ['2021', '2022', '2023'];
    const data = {
      company: 'Numeric Corp',
      sections: {
        'Income Statement': { dates, rows: [] },
        'Balance Sheet': { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        Ratios: {
          dates,
          rows: [{ label: 'Current Ratio', values: [1.1, 1.4, 1.6], dates }]
        }
      }
    };

    const results = analyze(data, 'default', {
      includeAnalystNoise: false
    }) as { sections: ResultSection[] };

    const debt = results.sections.find((s) => s.id === 'debt');
    const currentRatio = debt?.items.find((item) => item.name === 'Current Ratio');

    expect(currentRatio).toBeTruthy();
    expect(currentRatio?.detail).toContain('1.60');
    expect(currentRatio?.signalText).toMatch(/Healthy|Adequate|Very Healthy/);
  });
});


describe('i18n safeguards and bidirectional localization', () => {
  it('notifies language listeners and supports unsubscribe', () => {
    const events: string[] = [];
    const off = onLanguageChange((lang: string) => events.push(lang));

    setLanguage('en');
    setLanguage('es');
    off();
    setLanguage('en');

    expect(events).toEqual(['en', 'es']);
  });

  it('keeps stable fallback text when a translation key is missing in one language', () => {
    const originalI18n = (window as Window & { I18N?: unknown }).I18N;
    window.I18N = {
      en: {} as (typeof window.I18N)['en'],
      es: {} as (typeof window.I18N)['es']
    };

    document.body.innerHTML = '<span data-i18n="onlyEn">Texto base</span>';
    setLanguage('en');
    expect(document.querySelector('[data-i18n="onlyEn"]')?.textContent).toBe(
      'Texto base'
    );

    setLanguage('es');
    expect(document.querySelector('[data-i18n="onlyEn"]')?.textContent).toBe(
      'Texto base'
    );

    (window as Window & { I18N?: unknown }).I18N = originalI18n;
  });

  it('translates spanish financial labels back to english in dynamic text when language is en', () => {
    setLanguage('en');

    const html = renderDashboard(
      { company: 'Caja Corp' },
      makeResults({
        detail: 'Caja actual: Efectivo y equivalentes',
        signalText: 'Datos insuficientes'
      })
    );

    expect(html).toContain('Cash And Equivalents');
    expect(html).not.toContain('Efectivo y equivalentes');
  });

  it('translates dynamic text from spanish to english when current language is en', () => {
    setLanguage('en');

    const html = renderDashboard(
      { company: 'Acme Corp' },
      {
        overall: 'good',
        overallScore: 3,
        scores: {},
        totalMetrics: 1,
        sections: [
          {
            id: 'growth',
            icon: '📈',
            title: 'Crecimiento',
            grade: 'good',
            items: [
              {
                name: 'Crecimiento de Ingresos (CAGR)',
                detail: 'Datos insuficientes',
                confidence: 0.7,
                signal: 'neutral',
                signalText: 'Datos insuficientes',
                values: [null],
                labels: ['2024']
              }
            ]
          }
        ]
      }
    );

    expect(html).toContain('Growth');
    expect(html).toContain('Revenue Growth (CAGR)');
    expect(html).toContain('Insufficient data');
  });
});

describe('expanded TIKR metric coverage regressions', () => {
  it('ignores non-period consensus columns like CAGR when selecting forward values', () => {
    setLanguage('en');
    const dates = ['2025A', '2026E', '2027E', '2028E', '2029E', 'Crecmiento compuesto'];
    const data = {
      company: 'Consensus Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [{ label: 'Revenues', values: ['200', '', '', '', '', ''], dates }]
        },
        'Balance Sheet': { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        Ratios: { dates, rows: [] },
        'Consensus Estimates': {
          dates,
          rows: [
            {
              label: 'Ingresos',
              values: ['200', '210', '220', '225', '230', '9999'],
              dates
            }
          ]
        }
      }
    };

    const results = analyze(data, 'default', {
      includeAnalystNoise: false
    }) as { sections: ResultSection[] };

    const consensus = results.sections.find((s) => s.id === 'consensus');
    const revEstimate = consensus?.items.find(
      (item) => item.name === 'Consensus Revenue Estimate'
    );

    expect(revEstimate).toBeTruthy();
    expect(revEstimate?.detail).toContain('Fwd: $230M');
    expect(revEstimate?.detail).not.toContain('9999');
  });

  it('detects enterprise value from spanish "Valor empresarial total" labels', () => {
    setLanguage('en');
    const dates = ['2024', '2025'];
    const data = {
      company: 'EV Corp',
      sections: {
        'Income Statement': { dates, rows: [] },
        'Balance Sheet': { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        Ratios: { dates, rows: [] },
        'Valuation Multiples': {
          dates,
          rows: [
            { label: 'Capitalización bursátil (MM)', values: ['390000', '400000'], dates },
            { label: 'Valor empresarial total (MM)', values: ['370000', '380000'], dates }
          ]
        }
      }
    };

    const results = analyze(data, 'default', {
      includeAnalystNoise: false
    }) as { sections: ResultSection[] };

    const valuation = results.sections.find((s) => s.id === 'valuation');
    const evVsMc = valuation?.items.find(
      (item) => item.name === 'Enterprise Value vs Market Cap'
    );

    expect(evVsMc).toBeTruthy();
    expect(evVsMc?.detail).toContain('MC: $400.0B');
    expect(evVsMc?.detail).toContain('EV: $380.0B');
  });

  it('surfaces newly added DPO and debt/capital metrics when present in ratios', () => {
    setLanguage('en');
    const dates = ['2023', '2024', '2025'];
    const data = {
      company: 'Coverage Corp',
      sections: {
        'Income Statement': { dates, rows: [] },
        'Balance Sheet': { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        Ratios: {
          dates,
          rows: [
            {
              label: 'Promedio Días a pagar pendientes',
              values: ['95', '102', '110'],
              dates
            },
            {
              label: 'Deuda total / Capital total',
              values: ['40', '45', '50'],
              dates
            }
          ]
        }
      }
    };

    const results = analyze(data, 'default', {
      includeAnalystNoise: false
    }) as { sections: ResultSection[] };

    const efficiency = results.sections.find((s) => s.id === 'efficiency');
    const debt = results.sections.find((s) => s.id === 'debt');

    expect(
      efficiency?.items.some(
        (item) => item.name === 'Days Payable Outstanding (DPO)'
      )
    ).toBe(true);
    expect(
      debt?.items.some((item) => item.name === 'Total Debt / Capital')
    ).toBe(true);
  });
});


describe('cost and null-safety regressions', () => {
  it('stores cost ratio metrics as percentage series, not absolute amounts', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'Ratio Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [
            { label: 'Revenues', values: ['100', '120', '150'], dates },
            { label: 'Cost of Goods Sold', values: ['40', '54', '60'], dates },
            { label: 'Selling General & Admin Expenses', values: ['20', '24', '30'], dates }
          ]
        },
        'Balance Sheet': { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        Ratios: { dates, rows: [] }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as { sections: ResultSection[] };
    const costs = results.sections.find((section) => section.id === 'costs');
    const cogs = costs?.items.find((item) => item.name === 'COGS as % of Revenue');

    expect(cogs).toBeTruthy();
    expect(cogs?.values).toEqual([40, 45, 40]);
  });

  it('parses non-US currency prefixes in Price lines', () => {
    const parsed = parseTIKR(`# TEST – Example
Price: CA$ 123.45
Extracted: 2025-01-01
Period: Annual`);

    expect(parsed.price).toBe('CA$123.45');
    expect(parsed.priceNum).toBe(123.45);
  });
});
