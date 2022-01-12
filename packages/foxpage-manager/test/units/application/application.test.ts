import { FPApplication, Page } from '@foxpage/foxpage-types';

import { ApplicationImpl } from '@/application/application';

describe('application/application', () => {
  it('Receive: page remove', async () => {
    const appId = '1000';
    const app = new ApplicationImpl({ id: appId } as unknown as FPApplication, {});

    const page: Page = require('@@/data/content/page.json');

    app.pageManager.addPage(page);

    expect(await app.pageManager.exist(page.id)).toBeTruthy();

    await app.refresh({
      appId,
      contents: {
        page: { removes: [page.id], updates: [] },
      },
      timestamp: -1,
    });
    const result = await app.pageManager.exist(page.id);
    // disk not clear
    expect(result).toBeTruthy();
  });
});
