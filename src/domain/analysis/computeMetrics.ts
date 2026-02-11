import type { MetricValue } from '../types/analysis';
import type { ParsedDocument } from '../types/financial';

const findRow = (doc: ParsedDocument, ...names: string[]) => {
  const normalized = names.map((name) => name.toLowerCase());
  for (const section of doc.sections) {
    const row = section.table.rows.find((candidate) =>
      normalized.includes(candidate.normalizedName)
    );
    if (row) return row;
  }
  return undefined;
};

const firstValue = (rowValues: Array<{ value: number | null }>): number | null => {
  for (let i = rowValues.length - 1; i >= 0; i -= 1) {
    const value = rowValues[i]?.value;
    if (value !== null && value !== undefined) return value;
  }
  return null;
};

export function computeMetrics(doc: ParsedDocument): MetricValue[] {
  const revenueRow = findRow(doc, 'revenues', 'total revenues');
  const grossMarginRow = findRow(doc, '% gross margins', 'gross margin');
  const operatingMarginRow = findRow(doc, '% operating margins', 'operating margin');
  const fcfMarginRow = findRow(doc, '% free cash flow margins');
  const netDebtRow = findRow(doc, 'net debt');
  const ebitdaRow = findRow(doc, 'ebitda');

  const revenueValues = revenueRow?.cells.map((cell) => cell.value ?? null) ?? [];
  const newestRevenue = revenueValues.at(-1) ?? null;
  const oldestRevenue = revenueValues.find((value) => value !== null) ?? null;
  const years = Math.max(revenueValues.filter((value) => value !== null).length - 1, 1);
  const revenueCagr =
    newestRevenue && oldestRevenue && oldestRevenue > 0
      ? (Math.pow(newestRevenue / oldestRevenue, 1 / years) - 1) * 100
      : null;

  const netDebt = firstValue(netDebtRow?.cells ?? []);
  const ebitda = firstValue(ebitdaRow?.cells ?? []);

  return [
    { id: 'revenueCagr', label: 'Revenue CAGR', value: revenueCagr, unit: 'percent' },
    { id: 'grossMargin', label: 'Gross margin', value: firstValue(grossMarginRow?.cells ?? []), unit: 'percent' },
    { id: 'operatingMargin', label: 'Operating margin', value: firstValue(operatingMarginRow?.cells ?? []), unit: 'percent' },
    { id: 'fcfMargin', label: 'FCF margin', value: firstValue(fcfMarginRow?.cells ?? []), unit: 'percent' },
    {
      id: 'netDebtToEbitda',
      label: 'Net debt / EBITDA',
      value: netDebt !== null && ebitda && ebitda !== 0 ? netDebt / ebitda : null,
      unit: 'ratio'
    }
  ];
}
