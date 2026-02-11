import { describe, expect, it } from 'vitest';
import { buildScorecard } from './buildScorecard';

describe('buildScorecard', () => {
  it('wraps dashboard html into VM shape', () => {
    const vm = buildScorecard('<div>ok</div>');
    expect(vm.dashboardHtml).toBe('<div>ok</div>');
  });
});
