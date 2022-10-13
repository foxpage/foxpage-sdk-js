import { Context } from '../context';
import { PageParser } from './page';
import { VariableParser } from './variable';
import { ConditionParser } from './condition';
import { StructureNode } from '../structure';
import { MessageArray } from '../common';
import { Page } from '../manager';
import { FoxpageHooks } from '..';

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
  parse(sessionId: string, ctx: Context): Promise<{ parsed: StructureNode[]; messages?: MessageArray } | undefined>;
  isParsed(): boolean;
}
