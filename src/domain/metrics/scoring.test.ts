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
  values?: unknown;
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
    expect((opLeverage.values as { fullValues?: (number | null)[] } | undefined)?.fullValues).toEqual([30, 31, null, 33]);

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
    expect(html).toContain('recompras 97767 (79.3%)');
    expect(html).toContain('dividendos 15486 (12.6%)');
    expect(html).toContain('amortización de deuda 12085 (9.8%)');
    expect(html).toContain('aumento/acumulación de caja 15018 (12.2%)');
    expect(html).not.toContain('% )');
  });
});


describe('analysis regressions for alignment and period handling', () => {

  it('marks valuation as non-interpretable when market cap or EV are invalid', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
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

  it('flags EV/EBIT and EV/EBITDA when they are suspiciously identical', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'Mapping Risk Inc',
      sections: {
        'Income Statement': { dates, rows: [{ label: 'Revenue', values: ['100', '110', '120'], dates }] },
        'Balance Sheet': { dates, rows: [] },
        Ratios: { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        'Valuation Multiples': {
          dates,
          rows: [
            { label: 'Market Cap', values: ['1000', '1100', '1200'], dates },
            { label: 'Enterprise Value', values: ['1100', '1200', '1300'], dates },
            { label: 'NTM Total Enterprise Value / EBITDA', values: ['11.9', '12.0', '12.0'], dates },
            { label: 'EV/EBIT', values: ['12.0', '12.1', '12.0'], dates }
          ]
        }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const valuation = results.sections.find((s) => s.id === 'valuation');
    const evEbitda = valuation?.items.find((i) => i.name === 'EV/EBITDA (NTM)');
    const evEbit = valuation?.items.find((i) => i.name === 'EV/EBIT');

    expect(evEbitda?.signal).toBe('info');
    expect(evEbit?.signal).toBe('info');
    expect(evEbitda?.signalText).toContain('Data issue');
    expect(evEbit?.explanation || '').toContain('excluded from scoring');
    expect((evEbitda as { scoreRule?: string } | undefined)?.scoreRule || '').toContain('Do not score');
  });


  it('marks EV-based multiples as data issues when non-positive', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'Invalid Multiples LLC',
      sections: {
        'Income Statement': { dates, rows: [{ label: 'Revenue', values: ['100', '110', '120'], dates }] },
        'Balance Sheet': { dates, rows: [] },
        Ratios: { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        'Valuation Multiples': {
          dates,
          rows: [
            { label: 'Market Cap', values: ['1000', '1100', '1200'], dates },
            { label: 'Enterprise Value', values: ['1200', '1300', '1400'], dates },
            { label: 'NTM EV / Revenues', values: ['3.2', '0', '-1'], dates },
            { label: 'NTM Total Enterprise Value / EBITDA', values: ['10', '0', '0'], dates },
            { label: 'EV/EBIT', values: ['14', '-2', '0'], dates }
          ]
        }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const valuation = results.sections.find((s) => s.id === 'valuation');
    const evRev = valuation?.items.find((i) => i.name === 'EV / Revenues (NTM)');
    const evEbitda = valuation?.items.find((i) => i.name === 'EV/EBITDA (NTM)');
    const evEbit = valuation?.items.find((i) => i.name === 'EV/EBIT');

    expect(evRev?.signal).toBe('info');
    expect(evEbitda?.signal).toBe('info');
    expect(evEbit?.signal).toBe('info');
    expect(evEbitda?.signalText).toContain('Data issue');
    expect(evEbit?.explanation || '').toContain('excluded from scoring');
  });




  it('adds gross margin vs COGS consistency warning when they do not sum near 100%', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'Margin Mapping Inc',
      sections: {
        'Income Statement': {
          dates,
          rows: [
            { label: 'Revenues', values: ['100', '120', '150'], dates },
            { label: '% Gross Margins', values: ['60', '62', '65'], dates },
            { label: 'Cost of Goods Sold', values: ['55', '66', '82.5'], dates }
          ]
        },
        'Balance Sheet': { dates, rows: [] },
        Ratios: { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        'Valuation Multiples': { dates, rows: [] }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const costs = results.sections.find((s) => s.id === 'costs');
    const consistency = costs?.items.find(
      (i) => i.name === 'Gross Margin vs COGS Consistency Check'
    );

    expect(consistency).toBeTruthy();
    expect(consistency?.signal).toBe('info');
    expect(consistency?.signalText).toContain('Definition mismatch');
  });

  it('marks key non-EV valuation multiples as data issues when non-positive', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'Broken Multiples SA',
      sections: {
        'Income Statement': { dates, rows: [{ label: 'Revenue', values: ['100', '110', '120'], dates }] },
        'Balance Sheet': { dates, rows: [] },
        Ratios: { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        'Valuation Multiples': {
          dates,
          rows: [
            { label: 'Market Cap', values: ['1000', '1100', '1200'], dates },
            { label: 'Enterprise Value', values: ['1300', '1400', '1500'], dates },
            { label: 'NTM P/E', values: ['22', '0', '-5'], dates },
            { label: 'P/S', values: ['5', '0', '0'], dates },
            { label: 'P/B', values: ['4', '-1', '-2'], dates },
            { label: 'P/FCF', values: ['25', '-3', '0'], dates },
            { label: 'NTM Market Cap / Free Cash Flow', values: ['20', '0', '-1'], dates }
          ]
        }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const valuation = results.sections.find((s) => s.id === 'valuation');
    const pe = valuation?.items.find((i) => i.name === 'Forward P/E (NTM)');
    const ps = valuation?.items.find((i) => i.name === 'Price / Sales');
    const pb = valuation?.items.find((i) => i.name === 'Price / Book Value');
    const pfcf = valuation?.items.find((i) => i.name === 'Price / Free Cash Flow');
    const mcapFcf = valuation?.items.find((i) => i.name === 'Market Cap / Free Cash Flow (NTM)');

    [pe, ps, pb, pfcf, mcapFcf].forEach((item) => {
      expect(item?.signal).toBe('info');
      expect(item?.detail || '').toContain('N/A');
    });
    expect(pb?.signalText).toContain('Not interpretable');
  });


  it('adds FCF yield vs P/FCF consistency warning when inverse relation breaks', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'Yield Mismatch Co',
      sections: {
        'Income Statement': { dates, rows: [{ label: 'Revenue', values: ['100', '110', '120'], dates }] },
        'Balance Sheet': { dates, rows: [] },
        Ratios: { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        'Valuation Multiples': {
          dates,
          rows: [
            { label: 'Market Cap', values: ['1000', '1100', '1200'], dates },
            { label: 'Enterprise Value', values: ['1300', '1400', '1500'], dates },
            { label: 'FCF Yield', values: ['4', '5', '8'], dates },
            { label: 'NTM Market Cap / Free Cash Flow', values: ['20', '20', '20'], dates }
          ]
        }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const valuation = results.sections.find((s) => s.id === 'valuation');
    const consistency = valuation?.items.find(
      (i) => i.name === 'FCF Yield vs P/FCF Consistency Check'
    );

    expect(consistency).toBeTruthy();
    expect(consistency?.signal).toBe('info');
    expect(consistency?.signalText).toContain('Definition mismatch');
  });

  it('marks LTM EV multiples as data issues when non-positive', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'LTM Issues plc',
      sections: {
        'Income Statement': { dates, rows: [{ label: 'Revenue', values: ['100', '110', '120'], dates }] },
        'Balance Sheet': { dates, rows: [] },
        Ratios: { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        'Valuation Multiples': {
          dates,
          rows: [
            { label: 'Market Cap', values: ['1000', '1100', '1200'], dates },
            { label: 'Enterprise Value', values: ['1200', '1300', '1400'], dates },
            { label: 'LTM Total Enterprise Value / EBITDA', values: ['9', '4', '0'], dates },
            { label: 'LTM Total Enterprise Value / EBIT', values: ['10', '5', '-1'], dates }
          ]
        }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const valuation = results.sections.find((s) => s.id === 'valuation');
    const evEbitdaLtm = valuation?.items.find((i) => i.name === 'EV / EBITDA (LTM)');
    const evEbitLtm = valuation?.items.find((i) => i.name === 'EV / EBIT (LTM)');

    expect(evEbitdaLtm?.signal).toBe('info');
    expect(evEbitLtm?.signal).toBe('info');
    expect(evEbitdaLtm?.signalText).toContain('Data issue');
    expect(evEbitLtm?.explanation || '').toContain('excluded from scoring');
  });


  it('marks liquidity and coverage ratios as not interpretable when invalid or exploding', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'Ratio Edge Cases Ltd',
      sections: {
        'Income Statement': { dates, rows: [{ label: 'Revenue', values: ['100', '110', '120'], dates }] },
        'Balance Sheet': { dates, rows: [] },
        Ratios: {
          dates,
          rows: [
            { label: 'Current Ratio', values: ['1.2', '1.1', '0'], dates },
            { label: 'Quick Ratio', values: ['1.1', '1.0', '-1'], dates },
            { label: 'EBIT / Interest Expense', values: ['6', '8', '9999'], dates },
            { label: '(EBITDA - Capex) / Interest Expense', values: ['4', '5', '5000'], dates }
          ]
        },
        'Cash Flow': { dates, rows: [] },
        'Valuation Multiples': { dates, rows: [] }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const debt = results.sections.find((s) => s.id === 'debt');
    const current = debt?.items.find((i) => i.name === 'Current Ratio');
    const quick = debt?.items.find((i) => i.name === 'Quick Ratio (Acid Test)');
    const interest = debt?.items.find((i) => i.name === 'Interest Coverage (EBIT / Interest)');
    const cashlike = debt?.items.find((i) => i.name === '(EBITDA - Capex) / Interest');

    [current, quick, interest, cashlike].forEach((item) => {
      expect(item?.signal).toBe('info');
      expect(item?.signalText).toContain('Not interpretable');
      expect(item?.detail || '').toContain('N/A');
    });
  });

  it('adds EV vs Net Debt consistency warning when signs contradict', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'Contradiction Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [{ label: 'Revenue', values: ['100', '110', '120'], dates }]
        },
        'Balance Sheet': {
          dates,
          rows: [
            { label: 'Total Debt', values: ['200', '220', '250'], dates },
            { label: 'Cash And Equivalents', values: ['40', '45', '50'], dates },
            { label: 'Short-Term Investments', values: ['0', '0', '0'], dates }
          ]
        },
        Ratios: { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        'Valuation Multiples': {
          dates,
          rows: [
            { label: 'Market Cap', values: ['1000', '1100', '1200'], dates },
            { label: 'Enterprise Value', values: ['900', '1000', '1100'], dates }
          ]
        }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const balance = results.sections.find((s) => s.id === 'balance');
    const consistency = balance?.items.find(
      (i) => i.name === 'EV vs Net Debt Consistency Check'
    );

    expect(consistency).toBeTruthy();
    expect(consistency?.signal).toBe('info');
    expect(consistency?.signalText).toContain('Definition mismatch');
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
    const cogsValues = Array.isArray(cogs?.values) ? Array.from(cogs.values) : [];
    expect(cogsValues).toEqual([40, 45, 40]);
  });


  it('skips zero-denominator periods in ratio series instead of producing invalid percentages', () => {
    setLanguage('en');
    const dates = ['2022', '2023', '2024'];
    const data = {
      company: 'Zero Denominator Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [
            { label: 'Revenues', values: ['0', '100', '120'], dates },
            { label: 'Cost of Goods Sold', values: ['10', '40', '48'], dates }
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
    const cogsValues = Array.isArray(cogs?.values) ? Array.from(cogs.values) : [];
    expect(cogsValues).toEqual([40, 40]);
    expect(cogs?.detail).toContain('Latest: 40.0%');
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

describe('scoring regressions for period extraction and null-safe growth classification', () => {
  it('uses the year token from dd/mm/yy labels when computing CAGR windows', () => {
    setLanguage('en');
    const dates = ['29/09/20', '28/09/21', '27/09/22', '26/09/23', '28/09/24', '27/09/25'];
    const data = {
      company: 'Date Token Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [{ label: 'Revenues', values: ['100', '110', '125', '140', '160', '180'], dates }]
        },
        'Balance Sheet': { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        Ratios: { dates, rows: [] }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const growth = results.sections.find((s) => s.id === 'growth');
    const revenueGrowth = growth?.items.find((item) => item.name === 'Revenue Growth (CAGR)');

    expect(revenueGrowth?.detail).toContain('5Y CAGR');
  });

  it('marks CAGR growth as info when there is insufficient data', () => {
    setLanguage('en');
    const dates = ['2025'];
    const data = {
      company: 'Insufficient Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [{ label: 'Revenues', values: ['100'], dates }]
        },
        'Balance Sheet': { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        Ratios: { dates, rows: [] }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const growth = results.sections.find((s) => s.id === 'growth');
    const revenueGrowth = growth?.items.find((item) => item.name === 'Revenue Growth (CAGR)');

    expect(revenueGrowth?.detail).toContain('Insufficient data');
    expect(revenueGrowth?.signal).toBe('info');
    expect(revenueGrowth?.signalText).toBe('Insufficient data');
  });

  it('keeps ltm-only ratio series available instead of returning empty metrics', () => {
    setLanguage('en');
    const dates = ['TTM', 'LTM'];
    const data = {
      company: 'LTM Only Corp',
      sections: {
        'Income Statement': {
          dates,
          rows: [
            { label: 'Revenues', values: ['90', '100'], dates },
            { label: 'Cost of Goods Sold', values: ['35', '40'], dates }
          ]
        },
        'Balance Sheet': { dates, rows: [] },
        'Cash Flow': { dates, rows: [] },
        Ratios: { dates, rows: [] }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as {
      sections: ResultSection[];
    };

    const costs = results.sections.find((s) => s.id === 'costs');
    const cogs = costs?.items.find((item) => item.name === 'COGS as % of Revenue');

    expect(cogs).toBeTruthy();
    expect(cogs?.detail).toContain('Latest: 40.0%');
  });

  it('does not inject extra spaces before percent signs in narrative text', () => {
    setLanguage('en');
    const html = renderDashboard(
      { company: 'Percent Corp' },
      makeResults({ detail: 'Range 1.8% | Guide 5-10% | Interpretation: clean output' })
    );

    expect(html).toContain('1.8%');
    expect(html).toContain('5-10%');
    expect(html).not.toContain('1.8 %');
    expect(html).not.toContain('5-10 %');
  });

  it('keeps headline and bullets split correctly when detail uses pipe separators', () => {
    setLanguage('en');
    const html = renderDashboard(
      { company: 'Pipe Corp' },
      makeResults({ detail: 'Headline summary | Guide range: 5-10% | Interpretation: healthy' })
    );

    expect(html).toContain('<span class="md-kpi">Headline summary</span>');
    expect(html).toContain('<span class="md-label">Guide range:</span>');
    expect(html).toContain('5-10%');
  });
  it('derives market cap from price and filing-date shares when reported market cap is missing', () => {
    setLanguage('en');
    const dates = ['2024', '2025'];
    const data = {
      company: 'Derived MC Corp',
      priceNum: 274.62,
      sections: {
        'Income Statement': { dates, rows: [{ label: 'Revenue', values: ['100', '110'], dates }] },
        'Balance Sheet': {
          dates,
          rows: [
            { label: 'Total Shares Out. on Filing Date', values: ['15000', '14776.35'], dates }
          ]
        },
        'Cash Flow': {
          dates,
          rows: [
            { label: 'Common Stock Repurchased', values: ['-40000', '-45000'], dates },
            { label: 'Dividends Paid', values: ['-15000', '-16000'], dates }
          ]
        },
        Ratios: { dates, rows: [] },
        'Valuation Multiples': {
          dates,
          rows: [
            { label: 'Market Cap', values: ['0', '0'], dates },
            { label: 'Enterprise Value', values: ['4200000', '4300000'], dates }
          ]
        }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as { sections: ResultSection[] };
    const valuation = results.sections.find((s) => s.id === 'valuation');
    const shareholder = results.sections.find((s) => s.id === 'shareholder');
    const evVsMc = valuation?.items.find((i) => i.name === 'Enterprise Value vs Market Cap');
    const shYield = shareholder?.items.find((i) => i.name === 'Total Shareholder Yield');

    expect(evVsMc?.detail).toContain('MC from price × shares');
    expect(evVsMc?.signalText).not.toContain('Invalid valuation datapoint');
    expect(shYield?.detail).toContain('MC from price × shares');
    expect(shYield?.detail).toContain('1.5%');
  });

  it('avoids false debt mapping red flag and uses reported net debt sign when available', () => {
    setLanguage('en');
    const dates = ['2024', '2025'];
    const data = {
      company: 'Debt Mapping Corp',
      sections: {
        'Income Statement': { dates, rows: [{ label: 'Revenue', values: ['100', '110'], dates }] },
        'Balance Sheet': {
          dates,
          rows: [
            { label: 'Total Debt', values: ['110000', '112377'], dates },
            { label: 'Cash And Equivalents', values: ['30000', '35934'], dates },
            { label: 'Short-Term Investments', values: ['30000', '18763'], dates },
            { label: 'Long-Term Investments', values: ['70000', '77723'], dates },
            { label: 'Current Portion of Long-Term Debt', values: ['10000', '12350'], dates },
            { label: 'Long-Term Debt', values: ['70000', '78328'], dates },
            { label: 'Net Debt', values: ['-20000', '-20043'], dates }
          ]
        },
        'Cash Flow': { dates, rows: [{ label: 'Cash from Operations', values: ['90000', '95000'], dates }] },
        Ratios: { dates, rows: [{ label: 'Net Debt / EBITDA', values: ['-0.1', '-0.12'], dates }] },
        'Valuation Multiples': { dates, rows: [] }
      }
    };

    const results = analyze(data, 'default', { includeAnalystNoise: false }) as { sections: ResultSection[] };
    const balance = results.sections.find((s) => s.id === 'balance');
    const debtMapping = balance?.items.find((i) => i.name === 'Debt Mapping Integrity Check');
    const netDebtConsistency = balance?.items.find((i) => i.name === 'Net Debt Consistency Check');
    const netDebtNetCash = balance?.items.find((i) => i.name === 'Net Debt / Net Cash');

    expect(debtMapping).toBeFalsy();
    expect(netDebtConsistency).toBeFalsy();
    expect(netDebtNetCash?.detail).toContain('Net Cash');
  });

});
