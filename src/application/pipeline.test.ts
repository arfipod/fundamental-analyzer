import fs from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

type ParsedRow = {
  label: string;
  values: string[];
};

type ParsedSection = {
  dates: string[];
  rows: ParsedRow[];
};

type ParsedInput = {
  sections?: Record<string, ParsedSection>;
};


type AnalysisItem = {
  name?: string;
  detail?: string;
  signalText?: string;
};

type AnalysisSection = {
  items?: AnalysisItem[];
};

type AnalysisResult = {
  scores?: Record<string, unknown>;
  sections?: AnalysisSection[];
};

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    configurable: true
  });
  Object.defineProperty(globalThis, 'window', {
    value: {
      I18N: { en: {}, es: {} },
      GICS_INDUSTRIES: [],
      INDUSTRY_PROFILES: {}
    },
    configurable: true,
    writable: true
  });
});

describe('analysis pipeline', () => {
  it('parses and analyzes a real fixture without throwing', async () => {
    const { parseInput } = await import('./parse');
    const { runAnalysis } = await import('./analyze');

    const fixture = fs.readFileSync(
      path.resolve(process.cwd(), 'test-data/apple.md'),
      'utf8'
    );

    const parsed = parseInput(fixture) as ParsedInput;
    const results = runAnalysis(parsed, 'default', {
      includeAnalystNoise: false
    }) as AnalysisResult;

    expect(Object.keys(parsed.sections ?? {}).length).toBeGreaterThan(0);
    expect(Object.keys(results.scores ?? {}).length).toBeGreaterThan(0);
    expect(results.sections?.length).toBeGreaterThan(0);
  });


  it('adds special-case balance and data-quality commentary in metric details', async () => {
    const { parseInput } = await import('./parse');
    const { runAnalysis } = await import('./analyze');

    const fixture = fs.readFileSync(
      path.resolve(process.cwd(), 'test-data/apple.md'),
      'utf8'
    );

    const parsed = parseInput(fixture) as ParsedInput;
    const results = runAnalysis(parsed, 'default', {
      includeAnalystNoise: false
    }) as AnalysisResult;

    const allItems = (results.sections || []).flatMap((section: AnalysisSection) =>
      section.items || []
    );

    const retained = allItems.find((item) => item.name === 'Retained Earnings');
    expect(retained?.detail || '').toMatch(/recompras\/dividendos|buybacks\/dividends/i);

    const wcTurnover = allItems.find((item) => item.name === 'Working Capital Turnover');
    expect(wcTurnover?.detail || '').toMatch(/CCC|supplier-float|float/i);

    const evVsMc = allItems.find(
      (item) => item.name === 'Enterprise Value vs Market Cap'
    );
    expect(evVsMc).toBeTruthy();

    const netDebtNetCash = allItems.find((item) => item.name === 'Net Debt / Net Cash');
    expect(netDebtNetCash?.detail || '').toMatch(/definición consistente de caja|consistent cash definition/i);
  });

  it('avoids MC/EV 0.0B fallback failure on Apple-like input when Market Cap extraction is zero', async () => {
    const { parseInput } = await import('./parse');
    const { runAnalysis } = await import('./analyze');

    const markdown = `# – AAPL US$274.62 -US$3.50 -1,26% - TIKR Terminal

Price: | Extracted: 2026-02-10T13:17:26.285Z
Period: annual | Sections: 7

## Income Statement

| Income Statement | 28/09/24 | 27/09/25 |
| --- | --- | --- |
| Revenues | 391.035,00 | 416.161,00 |

## Balance Sheet

| Balance Sheet | 28/09/24 | 27/09/25 |
| --- | --- | --- |
| Total Shares Out. on Filing Date | 15.115,82 | 14.776,35 |
| Total Debt | 119.059,00 | 112.377,00 |
| Cash And Equivalents | 29.943,00 | 35.934,00 |
| Short Term Investments | 35.228,00 | 18.763,00 |
| Long-term Investments | 91.479,00 | 77.723,00 |
| Current Portion of Long-Term Debt | 10.912,00 | 12.350,00 |
| Long-Term Debt | 85.750,00 | 78.328,00 |
| Net Debt | (37.591,00) | (20.043,00) |

## Cash Flow

| Cash Flow Statement | 28/09/24 | 27/09/25 |
| --- | --- | --- |
| Repurchase of Common Stock | (100.390,00) | (96.671,00) |
| Common Dividends Paid | (15.234,00) | (15.421,00) |

## Ratios

| Ratios | 28/09/24 | 27/09/25 |
| --- | --- | --- |
| Net Debt / EBITDA | (0,25x) | (0,12x) |

## Valuation Multiples

| Multiples | 27/12/25 | 09/02/26 |
| --- | --- | --- |
| Total Enterprise Value (MM) | 4.019.811,91 | 3.977.448,67 |
| Market Cap (MM) | 0,00 | 0,00 |`;

    const parsed = parseInput(markdown) as ParsedInput;
    const results = runAnalysis(parsed, 'default', {
      includeAnalystNoise: false
    }) as AnalysisResult;

    const allItems = (results.sections || []).flatMap((section: AnalysisSection) =>
      section.items || []
    );
    const evVsMc = allItems.find(
      (item) => item.name === 'Enterprise Value vs Market Cap'
    );

    expect(evVsMc).toBeTruthy();
    expect(evVsMc?.detail || '').toContain('MC from price × shares');
    expect(evVsMc?.detail || '').not.toContain('MC: $0.0B | EV: $0.0B');
    expect(evVsMc?.signalText || '').not.toContain('Invalid valuation datapoint');
  });

  it('keeps EV vs MC valid on the full Apple fixture (no 0.0B/0.0B regression)', async () => {
    const { parseInput } = await import('./parse');
    const { runAnalysis } = await import('./analyze');

    const fixture = fs.readFileSync(
      path.resolve(process.cwd(), 'test-data/apple.md'),
      'utf8'
    );

    const parsed = parseInput(fixture) as ParsedInput;
    const results = runAnalysis(parsed, 'default', {
      includeAnalystNoise: false
    }) as AnalysisResult;

    const allItems = (results.sections || []).flatMap((section: AnalysisSection) =>
      section.items || []
    );
    const evVsMc = allItems.find(
      (item) => item.name === 'Enterprise Value vs Market Cap'
    );

    expect(evVsMc).toBeTruthy();
    expect(evVsMc?.detail || '').toContain('MC: $');
    expect(evVsMc?.detail || '').toContain('EV: $');
    expect(evVsMc?.detail || '').not.toContain('MC: $0.0B | EV: $0.0B');
    expect(evVsMc?.signalText || '').not.toContain('Invalid valuation datapoint');
  });

  it('parses english CSV financial exports and maps them to a statement section', async () => {
    const { parseInput } = await import('./parse');

    const csv = `Date,Revenues,Operating Income,Net Income,Effective Tax Rate %\n2023-05-31,49954,13670,8503,6.8266\n2024-05-31,52961,15764,10467,10.8508\n2025-05-31,57399,17954,12443,12.1257`;

    const parsed = parseInput(csv) as ParsedInput;
    const incomeStatement = parsed.sections?.['Income Statement'];

    expect(incomeStatement).toBeTruthy();
    expect(incomeStatement?.dates).toEqual([
      '2023-05-31',
      '2024-05-31',
      '2025-05-31'
    ]);
    expect(
      incomeStatement?.rows.some((r: ParsedRow) =>
        r.label === 'Revenues' || r.label === 'Total Revenues')
    ).toBe(
      true
    );
    expect(
      incomeStatement?.rows.some((r: ParsedRow) => r.label === 'Operating Income')
    ).toBe(true);
  });

  it('parses spanish semicolon CSV exports with decimal commas', async () => {
    const { parseInput } = await import('./parse');

    const csv = `"DateTime";"Ingresos";"Beneficio operativo";"Tasa efectiva de impuestos %"\n"2023-05-31 00:00:00";49954;13670;6,8266\n"2024-05-31 00:00:00";52961;15764;10,8508`;

    const parsed = parseInput(csv) as ParsedInput;
    const incomeStatement = parsed.sections?.['Income Statement'];

    expect(incomeStatement).toBeTruthy();
    const revenueRow = incomeStatement?.rows.find((r: ParsedRow) =>
      r.label === 'Revenues' || r.label === 'Ingresos'
    );
    const taxRateRow = incomeStatement?.rows.find(
      (r: ParsedRow) =>
        r.label === 'Effective Tax Rate %' ||
        r.label === 'Tasa efectiva de impuestos %'
    );

    expect(revenueRow?.values).toEqual(['49954', '52961']);
    expect(taxRateRow?.values).toEqual(['6,8266', '10,8508']);
  });

  it('analyzes balance-sheet-only CSV input without crashing', async () => {
    const { parseInput } = await import('./parse');
    const { runAnalysis } = await import('./analyze');

    const csv = `Date,Cash And Equivalents,Total Current Assets,Total Assets,Total Debt,Net Debt\n2006-05-31,6659,11974,29029,5894,-1711\n2025-11-30,19241,34366,204984,131730,111964`;

    const parsed = parseInput(csv) as ParsedInput;

    expect(parsed.sections?.['Balance Sheet']).toBeTruthy();
    expect(() =>
      runAnalysis(parsed, 'default', { includeAnalystNoise: false })
    ).not.toThrow();
  });

  it('analyzes cash-flow-only CSV input without crashing', async () => {
    const { parseInput } = await import('./parse');
    const { runAnalysis } = await import('./analyze');

    const csv = `Date,Net Income,Cash from Operations,Capital Expenditure,Free Cash Flow\n2006-05-31,3381,4541,-236,4305\n2025-11-30,15425,22296,-35477,-13181`;

    const parsed = parseInput(csv) as ParsedInput;

    expect(parsed.sections?.['Cash Flow']).toBeTruthy();
    expect(() =>
      runAnalysis(parsed, 'default', { includeAnalystNoise: false })
    ).not.toThrow();
  });

  it('parses separated markdown tables without ticker/company metadata', async () => {
    const { parseInput } = await import('./parse');

    const markdown = `| Income Statement | 31/12/23 | 31/12/24 | LTM |
| --- | --- | --- | --- |
| Total Revenues | 50.133,00 | 56.150,00 | 58.911,00 |
| Net Income to Common | 9.028,00 | 9.272,00 | 9.675,00 |

| Balance Sheet | 31/12/23 | 31/12/24 |
| --- | --- | --- |
| Total Assets | 230.682,00 | 246.548,00 |
| Total Equity | 59.507,00 | 64.021,00 |`;

    const parsed = parseInput(markdown) as ParsedInput;

    expect(parsed.sections?.['Income Statement']).toBeTruthy();
    expect(parsed.sections?.['Balance Sheet']).toBeTruthy();
    expect(
      parsed.sections?.['Income Statement']?.rows.some(
        (r: ParsedRow) =>
        r.label === 'Revenues' || r.label === 'Total Revenues'
      )
    ).toBe(true);
    expect(
      parsed.sections?.['Balance Sheet']?.rows.some(
        (r: ParsedRow) => r.label === 'Total Assets'
      )
    ).toBe(true);
  });
});
