import { FPFile, RenderAppInfo } from '@foxpage/foxpage-types';

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
    const file: FPFile = {
      intro: '',
      tags: [
        {
          pathname: '/3425/2022krkakaopaymoneydeal.html',
          isRoute: true,
        },
      ],
      suffix: '',
      id: 'file_Sf7MSz1WAIMec1h',
      applicationId: 'appl_zrvXd1AE3LIf8a9',
      name: '2022krkakaopaymoneydeal',
      type: 'page',
      extension: {
        promo: {
          promoID: 3425,
          ubtPageID: 10650072841,
        },
      },
    };

    const parsed = await parsePage(page, { appInfo, relationInfo, file });

    const str = JSON.stringify(parsed.page);
    expect(str).toBeDefined();
    expect(str).toMatch('html.body');
    expect(str).toMatch('100200');
  });
});
