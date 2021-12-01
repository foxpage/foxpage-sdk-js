import { FPApplication, Page } from '@foxpage/foxpage-types';

import { ApplicationImpl } from './../../../src/application/application';

describe('Application manager', () => {
  it('Receive: page remove', async () => {
    const appId = '1000';
    const app = new ApplicationImpl({ appId } as unknown as FPApplication, {});

    const page: Page = require('../../data/content/page.json');

    app.pageManager.addPage(page);

    expect(app.pageManager.exist(page.id)).toBeTruthy();

    await app.refresh({ page: { removes: [page.id] } });
    const result = app.pageManager.exist(page.id);

    expect(result).toBeFalsy();
  });
});
