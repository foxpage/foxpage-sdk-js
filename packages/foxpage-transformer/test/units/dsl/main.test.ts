import { Page } from '@foxpage/foxpage-types';

import { PageDSL } from '../../../src/interface';

import { transformToNewDSL, transformToOldDSL } from './../../../src/dsl/main';

describe('dsl main', () => {
  it('test transformToOldDSL', () => {
    const page: Page = require('../../data/page.json');
    const { pageDSL } = transformToOldDSL(page);
    expect(pageDSL).toBeDefined();
    expect(pageDSL.id).toBe(page.id);
    expect(pageDSL.structures.length).toBeGreaterThan(0);
  });

  it('test transformToNewDSL', () => {
    const dsl: PageDSL = require('../../data/page-dsl.json');
    const result = transformToNewDSL(dsl);
    expect(result).toBeDefined();
    expect(result.schemas.length).toBeGreaterThan(0);
  });
});
