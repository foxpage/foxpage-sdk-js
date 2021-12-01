import { Context } from '../context';
import { PageParser } from './page';
import { StructureNode } from '../structure';
import { MessageArray } from '../common';
import { Page } from '../manager';
import { FoxpageHooks } from '..';

export interface ParserOption {
  hooks?: {
    variable?: FoxpageHooks;
  }
}

export interface Parser {
  ctx?: Context;
  pageParser?: PageParser;
  messages: MessageArray;

  prepare(opt?: ParserOption): void;
  preParse(page: Page, ctx: Context): void;
  parse(): void;
  isParsed(): boolean;
}
