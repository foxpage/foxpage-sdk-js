import { FPFunction, ParsedContent } from '@foxpage/foxpage-types';

import { FunctionParser } from '../../../../src/parser/function';
import { mockRenderContextWithContent } from '../../../helper';

describe('function parser', () => {
  let parser: FunctionParser;

  beforeEach(() => {
    parser = new FunctionParser();
  });

  it('parse', () => {
    const fn: FPFunction = require('../../../data/function/function.json');
    const opt = {} as { parsed: Partial<ParsedContent<FPFunction>> };
    const ctx = mockRenderContextWithContent([fn], opt);
    parser.parse(ctx, {});
    expect(opt.parsed.parsed).toBeDefined();
  });
});
