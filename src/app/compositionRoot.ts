import { I18N } from '../domain/i18n/en';
import { GICS_INDUSTRIES, INDUSTRY_PROFILES } from '../domain/industry/data';
import { ConsoleLogger } from '../infrastructure/logging/consoleLogger';
import { LocalStorageAdapter } from '../infrastructure/storage/localStorage';

export function buildDependencies() {
  const storage = new LocalStorageAdapter();
  const logger = new ConsoleLogger();

  storage.migrateStorage();

  window.I18N = I18N;
  window.GICS_INDUSTRIES = GICS_INDUSTRIES;
  window.INDUSTRY_PROFILES = INDUSTRY_PROFILES;

  return { storage, logger };
}

declare global {
  interface Window {
    I18N: typeof I18N;
    GICS_INDUSTRIES: typeof GICS_INDUSTRIES;
    INDUSTRY_PROFILES: typeof INDUSTRY_PROFILES;
  }
}
