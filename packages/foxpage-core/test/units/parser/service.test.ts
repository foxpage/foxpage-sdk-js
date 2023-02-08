import { Context, Page } from '@foxpage/foxpage-types';

import { initParser, parse } from '@/parser/service';

import { mockRenderContextWithContent } from '@@/helper/render-context';

describe('parser/service', () => {
  let page: Page;

  beforeEach(() => {
    page = require('@@/data/page/page');
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
    expect(result.messages.length).toBe(0);

    const resultStr = JSON.stringify(result);
    expect(resultStr).toMatch('__templates');
    expect(resultStr).not.toMatch('doc.html');
  });

  it('Parse succeed', async () => {
    const opt = {
      parsed: {
        parseStatus: false,
        parsed: '',
      },
    };
    const mockConditionCtx = mockRenderContextWithContent([], opt);
    const template = require('@@/data/template/template');
    const ctx: Context = jest.fn().mockReturnValue({
      ...mockConditionCtx,
      origin: {
        templates: [template],
      },
      updatePage: () => {},
    })();
    await parse(page, ctx);
    // expect(opt.parsed.parseStatus).toBeTruthy();
    expect(opt.parsed.parsed).toBeDefined();
  });
});
