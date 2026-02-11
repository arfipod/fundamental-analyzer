import type {
  Cell,
  Currency,
  ParsedDocument,
  ParsedSection,
  Period,
  Row,
  SectionName,
  Units
} from '../types/financial';

const SECTION_MAP: Record<string, SectionName> = {
  'income statement': 'Income Statement',
  'balance sheet': 'Balance Sheet',
  'cash flow statement': 'Cash Flow Statement',
  valuation: 'Valuation'
};

const parseNumber = (raw: string): number | null => {
  const value = raw.trim();
  if (!value || value === '-' || /^n\/?a$/i.test(value)) return null;
  const negativeByParen = value.startsWith('(') && value.endsWith(')');
  const normalized = value
    .replace(/[,$€£%]/g, '')
    .replace(/\((.*)\)/, '$1')
    .replace(/\s+/g, '');
  if (!normalized) return null;
  const dotted = /\d,\d{1,2}$/.test(normalized)
    ? normalized.replace(/\./g, '').replace(',', '.')
    : normalized.replace(/,/g, '');
  const parsed = Number.parseFloat(dotted);
  if (Number.isNaN(parsed)) return null;
  return negativeByParen ? -parsed : parsed;
};

const normalizePeriod = (label: string): Period => ({
  label,
  normalizedLabel: label.trim().toLowerCase(),
  isLtm: /ltm/i.test(label)
});

const normalizeSection = (title: string): SectionName =>
  SECTION_MAP[title.trim().toLowerCase()] ?? 'Other';

const detectCurrency = (raw: string): Currency => {
  if (/\bUS\$|\bUSD\b/.test(raw)) return 'USD';
  if (/€|\bEUR\b/.test(raw)) return 'EUR';
  if (/£|\bGBP\b/.test(raw)) return 'GBP';
  return 'UNKNOWN';
};

const detectUnits = (raw: string): Units => {
  if (/\bbillions\b/i.test(raw)) return 'billions';
  if (/\bmillions\b/i.test(raw)) return 'millions';
  return 'raw';
};

export function parseInput(raw: string): ParsedDocument {
  const lines = raw.split(/\r?\n/);
  const sections: ParsedSection[] = [];
  let ticker = '';
  let company = 'Unknown';
  let currentSection = 'Other';
  let currentPeriods: Period[] = [];
  let currentRows: Row[] = [];

  const flush = () => {
    if (currentPeriods.length > 0 || currentRows.length > 0) {
      sections.push({
        section: normalizeSection(currentSection),
        table: { name: currentSection, periods: currentPeriods, rows: currentRows }
      });
    }
    currentPeriods = [];
    currentRows = [];
  };

  for (const line of lines) {
    if (!ticker && line.includes('–')) {
      const [t, ...rest] = line.split('–');
      ticker = t.trim();
      company = rest.join('–').trim();
    }
    if (/^[A-Z]{1,6}\s+[–-]\s+/.test(line)) {
      const [t, ...rest] = line.split(/[–-]/);
      ticker = t.trim();
      company = rest.join('-').trim();
    }
    if (line.trim().startsWith('|')) {
      const cells = line
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean);
      if (cells.length < 2) continue;
      const head = cells[0].toLowerCase();
      if ((head.includes('income') || head.includes('balance') || head.includes('cash flow')) && currentPeriods.length === 0) {
        currentPeriods = cells.slice(2).map(normalizePeriod);
      } else if (head.includes('tikr.com')) {
        currentPeriods = cells.slice(2).map(normalizePeriod);
      } else {
        const row: Row = {
          name: cells[0],
          normalizedName: cells[0].trim().toLowerCase(),
          cells: cells.slice(1).map((rawCell): Cell => ({ raw: rawCell, value: parseNumber(rawCell) }))
        };
        currentRows.push(row);
      }
      continue;
    }

    if (line.trim() && !line.includes('---') && !line.includes('Period:')) {
      if (currentRows.length > 0 || currentPeriods.length > 0) flush();
      currentSection = line.trim();
    }
  }

  flush();

  return {
    ticker: ticker || 'N/A',
    company,
    currency: detectCurrency(raw),
    units: detectUnits(raw),
    periods: sections[0]?.table.periods ?? [],
    sections,
    sourceLines: lines.length
  };
}
