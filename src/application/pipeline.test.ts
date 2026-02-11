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
    });

    expect(Object.keys(parsed.sections ?? {}).length).toBeGreaterThan(0);
    expect(Object.keys(results.scores ?? {}).length).toBeGreaterThan(0);
    expect(results.sections?.length).toBeGreaterThan(0);
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
      incomeStatement?.rows.some((r: ParsedRow) => r.label === 'Revenues')
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
});
