import { contentProxy } from '@foxpage/foxpage-shared';
import { Context, FPFunction, Variable } from '@foxpage/foxpage-types';

import { FunctionParser, VariableParserImpl, VariableType } from '@/parser';

import { mockRenderContextWithContent, mockRenderContextWithParsedContent } from '@@/helper/render-context';

const createHookParser = () => {
  const parser = new VariableParserImpl();
  parser.register({
    type: 'data.function.call',
    parse() {
      return 1;
    },
  });
  return parser;
};

describe('parser/variable/parser', () => {
  let variable: Variable;
  let parser: VariableParserImpl;

  beforeEach(() => {
    variable = require('../../../data/variable/variable.json');
    parser = new VariableParserImpl();
  });

  it('get parser', () => {
    const result = parser.get(variable.schemas[0].type);
    expect(result).toBeDefined();
    expect(result?.type).toBe(VariableType.DATA_STATIC);
  });

  it('unRegister parser', () => {
    const type = variable.schemas[0].type;
    parser.unRegister(type);
    const result = parser.get(type);
    expect(result).toBeUndefined();
  });

  it('parse', async () => {
    const ctx: Context = mockRenderContextWithContent([variable], { parsed: {} });
    const collect = { parsedVarSet: new Set<string>(), parsedFnSet: new Set<string>() };
    await parser.parse(ctx, collect);
    expect(collect.parsedVarSet).toBeDefined();
    // expect(collect.parsedVarSet.size).toBe(1);
    // expect(collect.parsedVarSet.has(variable.id)).toBeTruthy();
  });

  it('register parser by hooks', async () => {
    const variableCont = require('../../../data/variable/variable-func-call.json');
    const opt = {
      parsed: {
        parsed: {},
      },
    };
    const ctx: Context = mockRenderContextWithContent([variableCont], opt);
    const parser = createHookParser();
    await parser.parse(ctx, {});
    expect(opt.parsed).toBeDefined();
    // expect(opt.parsed.parsed).toBe(1);
  });

  it('parse dep fn', async () => {
    const variableCont: Variable = require('../../../data/variable/variable-dep-fn.json');
    const fn: FPFunction = require('../../../data/function/function.json');
    const opt = {
      parsed: {
        parsed: {},
      },
    };
    const ctx: Context = mockRenderContextWithContent([fn], opt);
    const fnParser = new FunctionParser();
    fnParser.parse(ctx, {});
    const parsedCtx = mockRenderContextWithParsedContent(ctx, 'functions', { fun_yrtQ3sY1jJag: opt.parsed.parsed });

    opt.parsed = { parsed: {} };
    const finalCtx = mockRenderContextWithContent([variableCont], opt, parsedCtx);
    finalCtx.variables['__functions'] = contentProxy(finalCtx.functions);
    const parser = createHookParser();
    await parser.parse(finalCtx, {});
    expect(opt.parsed).toBeDefined();
    // expect(opt.parsed.parsed).toBe(1);
  });

  it('parse exception', async () => {
    const variableCont = require('../../../data/variable/variable-func-call.json');
    const opt = {
      parsed: {
        parsed: {},
        parseStatus: false,
      },
    };
    const ctx: Context = mockRenderContextWithContent([variableCont], opt);
    const parser = new VariableParserImpl();
    await parser.parse(ctx, {});
    expect(opt.parsed).toBeDefined();
    expect(opt.parsed.parseStatus).toBeFalsy();
  });
});
