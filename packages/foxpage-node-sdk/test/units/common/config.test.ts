import config from '@/common/config';

describe('Common config', () => {
  it('Path ensureFileSync', async () => {
    try {
      const result = await config.init();
      expect(result).toBeDefined();
    } catch (e) {
      expect((e as Error).message).toContain('Not provider foxpage config file');
    }
  });
});
