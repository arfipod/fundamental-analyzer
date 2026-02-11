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

type RenderDashboardFn = (
  data: unknown,
  results: unknown,
  industrySelection?: unknown
) => string;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

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

describe('costco large pasted input', () => {
  it('parses and analyzes; renders dashboard when legacy renderer is available', async () => {
    const { parseInput } = await import('./parse');
    const { runAnalysis } = await import('./analyze');
    const { GICS_INDUSTRIES } = await import('../domain/industry/data');
    const scoringModule = await import('../domain/metrics/scoring');

    const input = fs.readFileSync(
      path.resolve(process.cwd(), 'test-data/costco.md'),
      'utf8'
    );

    expect(input.startsWith('# – COST US$997.59')).toBe(true);

    const parsed = parseInput(input);

    const runAnalysisCompat = runAnalysis as unknown as {
      (...args: unknown[]): unknown;
      length: number;
    };

    const results =
      runAnalysisCompat.length >= 3
        ? runAnalysisCompat(parsed, 'default', {
            includeAnalystNoise: false
          })
        : runAnalysisCompat(parsed, { industryCode: '255030' });

    expect(parsed.ticker).toBe('COST');
    expect(Object.keys(parsed.sections ?? {}).length).toBeGreaterThanOrEqual(6);

    if ('renderDashboard' in scoringModule) {
      const renderDashboardTyped =
        scoringModule.renderDashboard as RenderDashboardFn;
      const industrySelection =
        GICS_INDUSTRIES.find((item) => item.code === '255030') ??
        GICS_INDUSTRIES[0];

      const dashboardHtml = renderDashboardTyped(
        parsed,
        results,
        industrySelection
      );

      expect(dashboardHtml).toContain('score-row');
      expect(dashboardHtml).toContain('score-card');
      expect(dashboardHtml).toContain('dashboard-tab');
      expect(dashboardHtml).toContain('section-head');
      expect(dashboardHtml).toContain('dashboard-panel');
      return;
    }

    const resultsUnknown: unknown = results;
    expect(isRecord(resultsUnknown)).toBe(true);
    if (isRecord(resultsUnknown)) {
      const hasLegacyScores =
        isRecord(resultsUnknown['scores']) &&
        Object.keys(resultsUnknown['scores']).length > 0;
      const cardsValue = resultsUnknown['cards'];
      const hasVmCards = Array.isArray(cardsValue) && cardsValue.length > 0;
      expect(hasLegacyScores || hasVmCards).toBe(true);
    }
  });
});
