import { Context, Page } from '@foxpage/foxpage-types';

import { initParser, parse } from '../../../src/parser/service';
import { mockRenderContextWithContent } from '../../helper/render-context';

describe('Parser service', () => {
  let page: Page;

  beforeEach(() => {
    page = require('../../data/page/page');
    initParser();
  });

  it('Parse: No templates', async () => {
    const mockConditionCtx = mockRenderContextWithContent([]);
    const ctx: Context = jest.fn().mockReturnValue({
      ...mockConditionCtx,
      updatePage: () => {},
    })();
    const result = await parse(page, ctx);
    expect(result).toBeDefined();
    expect(result.messages.length).not.toBe(0);

    const resultStr = JSON.stringify(result);
    expect(resultStr).toMatch('__templates');
    expect(resultStr).not.toMatch('doc.html');
  });
});
