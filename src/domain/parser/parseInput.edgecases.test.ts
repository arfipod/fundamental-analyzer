import { describe, expect, it } from 'vitest';
import { parseInput } from './parseInput';

describe('parseInput numeric edge-cases', () => {
  it('normalizes parentheses negatives, percentages, thousand separators and empty values', () => {
    const input = `ACME – Acme Corp\nIncome Statement\n| Income Statement | TIKR.com | 2022 | LTM |\n| Revenues | 1,234 | 1,345 |\n| % Gross Margins | 45% | 46.5% |\n| Operating Income | (1,200) | (300) |\n| Other Row | — | N/A |\n`;

    const parsed = parseInput(input);
    const section = parsed.sections[0];
    const revenues = section.table.rows.find((row) => row.name === 'Revenues');
    const grossMargin = section.table.rows.find((row) => row.name === '% Gross Margins');
    const operatingIncome = section.table.rows.find((row) => row.name === 'Operating Income');
    const other = section.table.rows.find((row) => row.name === 'Other Row');

    expect(parsed.periods[1]?.isLtm).toBe(true);
    expect(revenues?.cells[0].value).toBe(1234);
    expect(grossMargin?.cells[1].value).toBe(46.5);
    expect(operatingIncome?.cells[0].value).toBe(-1200);
    expect(other?.cells[0].value).toBeNull();
    expect(other?.cells[1].value).toBeNull();

    for (const row of section.table.rows) {
      for (const cell of row.cells) {
        if (cell.value !== null) {
          expect(Number.isNaN(cell.value)).toBe(false);
        }
      }
    }
  });
});
