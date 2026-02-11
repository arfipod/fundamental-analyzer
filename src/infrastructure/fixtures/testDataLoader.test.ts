import { describe, expect, it, vi } from 'vitest';
import { loadTestData } from './testDataLoader';

describe('loadTestData', () => {
  it('loads markdown fixture via fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, text: async () => '# fixture' })
    );

    await expect(loadTestData('apple')).resolves.toBe('# fixture');
  });

  it('throws when response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, text: async () => '' })
    );

    await expect(loadTestData('missing')).rejects.toThrow(
      'Unable to load fixture missing'
    );
  });
});
