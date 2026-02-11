import { describe, expect, it, beforeEach } from 'vitest';
import { LANGUAGE_KEY, LocalStorageAdapter } from './localStorage';

class MemoryStorage {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  clear(): void {
    this.data.clear();
  }
}

const localStorageMock = new MemoryStorage();

beforeEach(() => {
  localStorageMock.clear();
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    configurable: true
  });
});

describe('LocalStorageAdapter', () => {
  it('gets and sets values', () => {
    const adapter = new LocalStorageAdapter();
    adapter.set('x', '1');
    expect(adapter.get('x')).toBe('1');
  });

  it('migrates unsupported language values to es', () => {
    localStorageMock.setItem(LANGUAGE_KEY, 'fr');
    const adapter = new LocalStorageAdapter();
    adapter.migrateStorage();
    expect(adapter.get(LANGUAGE_KEY)).toBe('es');
  });

  it('keeps valid language values', () => {
    localStorageMock.setItem(LANGUAGE_KEY, 'en');
    const adapter = new LocalStorageAdapter();
    adapter.migrateStorage();
    expect(adapter.get(LANGUAGE_KEY)).toBe('en');
  });
});
