import { Messages } from '@foxpage/foxpage-shared';
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

  const sessionId = Symbol(new Date().getTime()) as unknown as string;

  try {
    parser.preParse(page, ctx, { sessionId });

    const result = await parser.parse(sessionId, ctx);
    const { parsed, messages } = result || {};

    parser.reset({ sessionId });

    return {
      messages,
      page: {
        id: page.id,
        schemas: parsed,
      },
      ctx,
    };
  } catch (e) {
    ctx.logger?.error('parse failed:', e);
    parser.reset({ sessionId });
    return {
      messages: [] as Messages[],
      page: {},
      ctx,
    };
  }
};
