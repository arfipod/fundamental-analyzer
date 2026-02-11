import { ConsoleLogger } from '../infrastructure/logging/consoleLogger';
import { LocalStorageAdapter } from '../infrastructure/storage/localStorage';

export function buildDependencies() {
  const storage = new LocalStorageAdapter();
  const logger = new ConsoleLogger();
  storage.migrateStorage();
  return { storage, logger };
}
