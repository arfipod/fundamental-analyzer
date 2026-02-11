// @vitest-environment jsdom
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
    value: {
      I18N: { en: {}, es: {} },
      GICS_INDUSTRIES: [],
      INDUSTRY_PROFILES: {}
    },
    configurable: true,
    writable: true
  });
});

describe('apple large pasted input', () => {
  it('parses, analyzes and renders the full dashboard core', async () => {
    const { parseInput } = await import('./parse');
    const { runAnalysis } = await import('./analyze');
    const { GICS_INDUSTRIES } = await import('../domain/industry/data');
    const { renderDashboard } = await import('../domain/metrics/scoring');

    type RenderDashboardFn = (
      data: unknown,
      results: unknown,
      industrySelection?: unknown
    ) => string;
    const renderDashboardTyped = renderDashboard as unknown as RenderDashboardFn;

    const input = fs.readFileSync(
      path.resolve(process.cwd(), 'test-data/apple.md'),
      'utf8'
    );

    expect(input.startsWith('# – AAPL US$274.62')).toBe(true);

    const parsed = parseInput(input);
    const results = runAnalysis(parsed, 'default', {
      includeAnalystNoise: false
    });

    const industrySelection =
      GICS_INDUSTRIES.find((item) => item.code === '452020') ??
      GICS_INDUSTRIES[0];

    const dashboardHtml = renderDashboardTyped(
      parsed,
      results,
      industrySelection
    );

    expect(parsed.ticker).toBe('AAPL');
    expect(Object.keys(parsed.sections ?? {}).length).toBeGreaterThanOrEqual(6);
    expect(Object.keys(results.scores ?? {}).length).toBeGreaterThan(5);

    expect(dashboardHtml).toContain('score-row');
    expect(dashboardHtml).toContain('score-card');
    expect(dashboardHtml).toContain('dashboard-tab');
    expect(dashboardHtml).toContain('section-head');
    expect(dashboardHtml).toContain('dashboard-panel');
  });
});
