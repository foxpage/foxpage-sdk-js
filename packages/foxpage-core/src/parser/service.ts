import { Context, Page, ParserOption } from '@foxpage/foxpage-types';

import { ParserImpl } from './parser';

let parser: ParserImpl;

/**
 * init parser
 * @param opt parser init options
 * @returns parser instance
 */
export const initParser = async (opt?: ParserOption) => {
  parser = new ParserImpl();
  await parser.prepare(opt);
  return parser;
};

/**
 * get the parser instance
 * @returns parser
 */
export const getParser = () => {
  return parser;
};

/**
 * parse
 * @param page page content
 * @param ctx Context
 * @returns parsed
 */
export const parse = async (page: Page, ctx: Context) => {
  if (!parser) {
    const msg = 'parser instance is invalid.';
    ctx.logger?.error(msg);
    throw new Error('msg');
  }

  parser.preParse(page, ctx);
  const parsed = await parser.parse();

  const result = {
    messages: parser.messages,
    page: {
      id: page.id,
      schemas: parsed,
    },
    ctx: parser.ctx || ctx,
  };

  parser.reset();

  return result;
};
