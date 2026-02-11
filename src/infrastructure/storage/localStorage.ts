import type { StoragePort } from '../../ports/storage';

export const LANGUAGE_KEY = 'fundamentalAnalyzerLang';

export class LocalStorageAdapter implements StoragePort {
  get<T extends string>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value as T | null;
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  migrateStorage(): void {
    const value = this.get<string>(LANGUAGE_KEY);
    if (value !== 'en' && value !== 'es') {
      this.set(LANGUAGE_KEY, 'es');
    }
  }
}
