import { Block, Context, Page, Template } from '@foxpage/foxpage-types';

import { MainParser } from '@/parser/main';

import { mockRenderContext } from '@@/helper';

describe('parser/block/parser', () => {
  it('parse', async () => {
    const page: Page = require('@@/data/mocker/page');
    const template: Template = require('@@/data/mocker/template');
    const block: Block = require('@@/data/mocker/block');

    let parsedBlock: Block | null = null;
    const ctx = {
      ...mockRenderContext(),
      origin: {
        templates: [template],
      },
      getOrigin: (type: string) => {
        if (type === 'page') {
          return page;
        }
        if (type === 'templates') {
          return [template];
        }
        if (type === 'blocks') {
          return [block];
        }
      },
      updateResource: (target: string, _key: string, value: any) => {
        if (target === 'blocks') {
          parsedBlock = value as Block;
        }
      },
    } as Context;

    const mainParser = new MainParser({ content: page }, ctx);
    const result = await mainParser.parse(ctx);
    expect(result).toBeDefined();
    expect(JSON.stringify(parsedBlock)).toContain('the block test value');
  });
});
