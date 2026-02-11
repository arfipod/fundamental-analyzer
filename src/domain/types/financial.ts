export type SectionName =
  | 'Income Statement'
  | 'Balance Sheet'
  | 'Cash Flow Statement'
  | 'Valuation'
  | 'Other';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'UNKNOWN';
export type Units = 'raw' | 'millions' | 'billions' | 'percent';

export interface Period {
  label: string;
  normalizedLabel: string;
  isLtm: boolean;
}

export interface Cell {
  raw: string;
  value: number | null;
}

export interface Row {
  name: string;
  normalizedName: string;
  cells: Cell[];
}

export interface Table {
  name: string;
  periods: Period[];
  rows: Row[];
}

export interface ParsedSection {
  section: SectionName;
  table: Table;
}

export interface ParsedDocument {
  ticker: string;
  company: string;
  currency: Currency;
  units: Units;
  periods: Period[];
  sections: ParsedSection[];
  sourceLines: number;
}
