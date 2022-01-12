import { Condition, Context, Page, RenderAppInfo } from '@foxpage/foxpage-types';

import { ContextInstance } from '@/context/render';

class RenderContext extends ContextInstance {}

const page: Page = require('@@/data/page.json');
const condition: Condition = require('@@/data/condition.json');

describe('context/render', () => {
  let context: Context;
  beforeEach(() => {
    context = new RenderContext({ appId: '1000', slug: '/test' } as RenderAppInfo);
  });

  afterEach(() => {
    context = null;
  });

  it('instance test', () => {
    expect(context).toBeDefined();
    expect(context.origin.page).toBeUndefined();
    expect(context.origin.conditions).toBeUndefined();

    context.updateOriginPage(page);
    expect(context.origin.page).toBeDefined();
    expect(context.origin.page.id).toBe(page.id);
  });

  it('updateOrigin test', () => {
    expect(context).toBeDefined();
    expect(context.origin.page).toBeUndefined();
    expect(context.origin.conditions).toBeUndefined();

    context.updateOrigin({ conditions: [condition] });

    expect(context.origin.conditions).toBeDefined();
    expect(context.origin.conditions[0].id).toBe(condition.id);
  });

  it('get variables test', () => {
    const result = context.variables;
    expect(result).toBeDefined();
    expect(result['__functions']).toBeDefined();
  });
});
