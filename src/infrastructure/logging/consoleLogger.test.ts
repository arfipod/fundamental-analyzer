import { describe, expect, it, vi } from 'vitest';
import { ConsoleLogger } from './consoleLogger';

describe('ConsoleLogger', () => {
  it('forwards info/error to console', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const logger = new ConsoleLogger();
    logger.info('hello', { x: 1 });
    logger.error('boom', { y: 2 });

    expect(infoSpy).toHaveBeenCalledWith('hello', { x: 1 });
    expect(errorSpy).toHaveBeenCalledWith('boom', { y: 2 });

    infoSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
