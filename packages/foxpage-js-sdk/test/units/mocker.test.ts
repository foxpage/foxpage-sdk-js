import { Mock, Page } from '@foxpage/foxpage-types';

import { MockOption, withMock } from '../../src/mocker';

describe('Mocker test', () => {
  it('with mock test', () => {
    const page: Page = require('../data/mock/content.json');
    const mocks: Mock[] = require('../data/mock/mocks.json');
    const opt: MockOption = require('../data/mock/opt.json');
    const extendPage: Page = require('../data/mock/extendPage.json');
    opt.relationInfo.extendPage = extendPage;
    const result = withMock(page, mocks, opt);
    expect(result).toBeDefined();
  });
});
