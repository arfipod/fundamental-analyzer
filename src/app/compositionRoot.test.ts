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
  Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true });
});

describe('buildDependencies', () => {
  it('returns storage and logger and migrates language', () => {
    const deps = buildDependencies();
    expect(deps.storage).toBeDefined();
    expect(deps.logger).toBeDefined();
    expect(localStorage.getItem('fundamentalAnalyzerLang')).toBe('es');
  });
});
