import type { LoggerPort } from '../../ports/logger';

export class ConsoleLogger implements LoggerPort {
  info(message: string, meta?: unknown): void {
    console.info(message, meta);
  }

  error(message: string, meta?: unknown): void {
    console.error(message, meta);
  }
}
