import { Condition, ParsedContent, Variable } from '@foxpage/foxpage-types';

import { ConditionParser } from '../../../../src/parser/condition';
import { VariableParser } from '../../../../src/parser/variable';
import {
  ConditionParsed,
  mockRenderContextWithConAndVariable,
  mockRenderContextWithContent,
  mockRenderContextWithParsedContent,
  VariableParsed,
} from '../../../helper';

describe('condition parser', () => {
  let parser: ConditionParser;

  beforeEach(() => {
    parser = new ConditionParser();
  });

  it('parse or return true', () => {
    const condition: Condition = require('../../../data/condition/condition-or.json');
    const opt = {} as { parsed: Partial<ParsedContent<Condition>> };
    const ctx = mockRenderContextWithContent([condition], opt);
    parser.parse(ctx);
    expect(opt.parsed.content).toBeDefined();
    expect(opt.parsed.parsed).toBeTruthy();
  });

  it('parse and return false', () => {
    const condition: Condition = require('../../../data/condition/condition-and.json');
    const opt = {} as { parsed: Partial<ParsedContent<Condition>> };
    const ctx = mockRenderContextWithContent([condition], opt);
    parser.parse(ctx);
    expect(opt.parsed.content).toBeDefined();
    expect(opt.parsed.parsed).toBeFalsy();
  });

  it('parse with dependency variable no parse', () => {
    const condition: Condition = require('../../../data/condition/condition-dep-variables.json');
    const variable: Variable = require('../../../data/variable/variable.json');
    const opt = { conParsed: {}, varParsed: {} } as { conParsed: ConditionParsed; varParsed: VariableParsed };
    const ctx = mockRenderContextWithConAndVariable(condition, variable, opt);
    parser.parse(ctx);
    expect(JSON.stringify(opt.varParsed)).toBe('{}');
    expect(opt.conParsed).toBeDefined();
    expect(opt.conParsed.parsed).toBeFalsy();
  });

  it('parse with dependency variable parsed', async () => {
    const condition: Condition = require('../../../data/condition/condition-dep-variables.json');
    const variable: Variable = require('../../../data/variable/variable.json');
    const opt = { conParsed: {}, varParsed: {} } as { conParsed: ConditionParsed; varParsed: VariableParsed };
    const ctx = mockRenderContextWithConAndVariable(condition, variable, opt);
    const variableParser = new VariableParser();
    await variableParser.parse(ctx, {});
    const parsedCtx = mockRenderContextWithParsedContent(ctx, 'variables', opt.varParsed);
    parser.parse(parsedCtx);
    expect(opt.varParsed).toBeDefined();
    expect(opt.conParsed).toBeDefined();
    expect(opt.conParsed.con_1b652910e89b).toBeTruthy();
  });
});
