import { RenderAppInfo } from '@foxpage/foxpage-types';

import { parsePage } from '../../src/main';
import { condition, fn, page, template, variable } from '../data/parse';

describe('main', () => {
  it('parse page', async () => {
    const appInfo: RenderAppInfo = {
      appId: '1000',
      slug: '/test',
      configs: {},
    };
    const relationInfo = {
      templates: [template],
      variables: [variable],
      conditions: [condition],
      functions: [fn],
    };
    const parsed = await parsePage(page, { appInfo, relationInfo });

    const str = JSON.stringify(parsed.page);
    expect(str).toBeDefined();
    expect(str).toMatch('html.body');
    expect(str).toMatch('100200');
  });
});
