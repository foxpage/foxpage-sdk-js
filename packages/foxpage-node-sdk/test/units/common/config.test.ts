import config from '../../../src/common/config';

describe('Common config', () => {
  it('Path ensureFileSync', async () => {
    const result = await config.init();
    expect(result).toBeDefined();
  });
});
