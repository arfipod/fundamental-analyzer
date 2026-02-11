import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseInput } from './parseInput';

const fixtures = ['apple.md', 'palantir.md', 'constellation-software.md'];

describe('parseInput golden fixtures', () => {
  for (const fixtureName of fixtures) {
    it(`parses ${fixtureName}`, () => {
      const raw = fs.readFileSync(path.resolve(process.cwd(), 'test-data', fixtureName), 'utf8');
      const parsed = parseInput(raw);
      expect({
        ticker: parsed.ticker,
        company: parsed.company,
        sections: parsed.sections.map((section) => ({
          name: section.table.name,
          periodCount: section.table.periods.length,
          rowCount: section.table.rows.length
        }))
      }).toMatchSnapshot();
    });
  }
});
