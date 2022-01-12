import { Page } from '@foxpage/foxpage-types';

import { PageInstance } from '@/page/page';

const pageContent = require('@@/data/content/page.json');

describe('page/manager', () => {
  it('Test templates dependency', () => {
    const mockFileContent = pageContent as Page;
    const fileContent = new PageInstance(mockFileContent);
    const existTemplate = fileContent.relationMap.has('templates');
    expect(existTemplate).toBeTruthy();
  });
});
