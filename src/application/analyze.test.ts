import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { analyze } from './analyze';
import { parseInput } from './parse';

describe('analyze view-model snapshots', () => {
  it('builds stable VM for apple fixture', () => {
    const raw = fs.readFileSync(path.resolve(process.cwd(), 'test-data/apple.md'), 'utf8');
    const vm = analyze(parseInput(raw), { industryCode: '451020' });
    expect(vm).toMatchSnapshot();
  });

  it('builds stable VM for costco fixture', () => {
    const raw = fs.readFileSync(path.resolve(process.cwd(), 'test-data/costco.md'), 'utf8');
    const vm = analyze(parseInput(raw), { industryCode: '201060' });
    expect(vm).toMatchSnapshot();
  });
});
