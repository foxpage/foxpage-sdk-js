import { Page } from '@foxpage/foxpage-types';

import { PageInstance } from './../../../src/page/page';

const pageContent = require('../../data/file-content/page.json');

describe('Manager page test', () => {
  it('Test templates dependency', () => {
    const mockFileContent = pageContent as Page;
    const fileContent = new PageInstance(mockFileContent);
    const existTemplate = fileContent.relationMap.has('templates');
    expect(existTemplate).toBeTruthy();
  });
});
