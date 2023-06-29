import { Page, RelationInfo } from '@foxpage/foxpage-types';

import { createContentInstance } from '@/content';

describe('content/main', () => {
  it('createContentInstance test', () => {
    const page = require('@@/data/page.json');
    const relations = {
      pages: [page],
    } as RelationInfo & { pages: Page[] };
    const contentInstances = createContentInstance({ ...relations });
    expect(contentInstances).toBeDefined();
    expect(contentInstances.pages[0]).toBeDefined();
    expect(contentInstances.pages[0].id).toEqual(page.id);
  });
});
