import { ContentDetail } from '../content';
import { Context } from '../context';
import { FoxpageHooks } from '../hook';
import { Page } from '../manager';

import { ConditionParser } from './condition';
import { VariableParser } from './variable';

export interface ParserOption {
  hooks?: {
    variable?: FoxpageHooks;
  };
}

export interface Parser {
  variableParser?: VariableParser;
  conditionParser?: ConditionParser;

  prepare(opt?: ParserOption): void;
  preParse(page: Page, ctx: Context, opt: { sessionId: string }): void;
  parse(
    sessionId: string,
    ctx: Context,
  ): Promise<{ parsed: ContentDetail | undefined; messages: string[] } | undefined>;
  isParsed(): boolean;
}
