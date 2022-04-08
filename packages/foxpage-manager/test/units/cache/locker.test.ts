import { join } from 'path';

import { locker } from '@/cache';

describe('cache/locker test', () => {
  it('lock test', async () => {
    const dir = join(__dirname, `demo.${new Date().getTime()}.js`);
    await locker.lock(dir, () => {});
    await locker.lock(dir, () => {});
    await locker.unlock(dir, () => {});
  });
});
