import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { analyze } from './analyze';
import { parseInput } from './parse';

describe('analysis pipeline', () => {
  it('parses and analyzes a real fixture without throwing', () => {
    const fixture = fs.readFileSync(path.resolve(process.cwd(), 'test-data/apple.md'), 'utf8');
    const parsed = parseInput(fixture);
    const vm = analyze(parsed, { industryCode: '451020' });

    expect(parsed.sections.length).toBeGreaterThan(0);
    expect(vm.cards.length).toBeGreaterThan(0);
    expect(vm.sections.length).toBeGreaterThan(0);
  });
});
