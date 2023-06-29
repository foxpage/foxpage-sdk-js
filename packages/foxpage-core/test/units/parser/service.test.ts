import { ContextInstance, createContentInstance } from '@foxpage/foxpage-shared';
import { Context, Page, RenderAppInfo } from '@foxpage/foxpage-types';

import * as merger from '@/merger';
import { initParser, parse, parseStructure } from '@/parser/service';

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

  it('Parse: Only structure', async () => {
    const parent = require('@@/data/merge/parent');
    const child = require('@@/data/merge/child');
    const template = require('@@/data/merge/template');
    const mergeContent = merger.merge(parent || {}, child || {}, {
      strategy: merger.MergeStrategy.COMBINE_BY_EXTEND,
    });

    class RenderContextInstance extends ContextInstance implements Context {
      constructor(info: RenderAppInfo) {
        super(info);
      }
    }

    const ctx: Context = new RenderContextInstance({} as RenderAppInfo);
    const contentInstances = createContentInstance({
      templates: [{ ...template, type: 'template' }],
      blocks: [],
      pages: [{ ...mergeContent, type: 'page' }],
    });
    ctx.updateOrigin({
      ...contentInstances,
    });
    if (contentInstances.pages) {
      ctx.updateOriginPage(contentInstances.pages[0]);
    }
    // parse
    const parsed = await parseStructure(contentInstances.pages[0], ctx);
    expect(mergeContent).toBeDefined();
    expect(parsed).toBeDefined();
  });
});
