import { Page, RelationInfo } from '@foxpage/foxpage-types';

import { createContentInstance } from '@/content';

describe('content/main', () => {
  it('createContentInstance test', () => {
    const page = require('@@/data/page.json');
    const relations = {
      page: [page],
    } as RelationInfo & { page: Page[] };
    const contentInstances = createContentInstance({ ...relations });
    expect(contentInstances).toBeDefined();
    expect(contentInstances.page).toBeDefined();
    expect(contentInstances.page[0].id).toEqual(page.id);
  });
});
