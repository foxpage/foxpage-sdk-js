import { Page } from '@foxpage/foxpage-types';

import { PageParserImpl } from '@/parser/page';

import { mockRenderContext } from '@@/helper';

describe('parser/page/parser', () => {
  let parser: PageParserImpl;
  beforeEach(() => {
    const page: Page = require('@@/data/page/page-with-condition.json');
    parser = new PageParserImpl(page);
  });

  it('parse with condition', () => {
    const ctx = mockRenderContext();
    ctx.variables = {
      __conditions: { con_1b652910e89b: true, con_1b652910e891: false },
    };
    const result = parser.parse(ctx);
    expect(result).toBeDefined();
    expect(JSON.stringify(result)).toMatch('"show":false');
  });
});
