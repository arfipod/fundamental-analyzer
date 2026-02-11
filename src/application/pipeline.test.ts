import fs from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

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
    value: { I18N: { en: {}, es: {} }, GICS_INDUSTRIES: [], INDUSTRY_PROFILES: {} },
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

    const parsed = parseInput(fixture);
    const results = runAnalysis(parsed, 'default', { includeAnalystNoise: false });

    expect(Object.keys(parsed.sections ?? {}).length).toBeGreaterThan(0);
    expect(Object.keys(results.scores ?? {}).length).toBeGreaterThan(0);
    expect(results.sections?.length).toBeGreaterThan(0);
  });
});
