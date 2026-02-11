import { beforeEach, describe, expect, it } from 'vitest';
import { buildDependencies } from './compositionRoot';

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    configurable: true
  });
  Object.defineProperty(globalThis, 'window', {
    value: {},
    configurable: true,
    writable: true
  });
});

describe('buildDependencies', () => {
  it('wires datasets and i18n on window and returns adapters', () => {
    const deps = buildDependencies();
    expect(deps.storage).toBeDefined();
    expect(deps.logger).toBeDefined();
    const win = window as unknown as { I18N: { en: { appTitle: string } }; GICS_INDUSTRIES: unknown[] };
    expect(win.I18N.en.appTitle).toBe('Fundamental Analyzer');
    expect(Array.isArray(win.GICS_INDUSTRIES)).toBe(true);
  });
});
