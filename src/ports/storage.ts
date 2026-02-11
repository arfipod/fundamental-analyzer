export interface StoragePort {
  get<T extends string>(key: string): T | null;
  set(key: string, value: string): void;
  migrateStorage(): void;
}
