import { Messages } from '@foxpage/foxpage-shared';
import { Context, ContextPage, ParserOption } from '@foxpage/foxpage-types';

import { MainParser } from './main';
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
 * parse content
 * @param content content
 * @param ctx Context
 * @returns parsed
 */
export const parse = async <T extends ContextPage>(content: T, ctx: Context) => {
  if (!parser) {
    const msg = 'parser instance is invalid.';
    ctx.logger?.error(msg);
    throw new Error(msg);
  }

  const sessionId = Symbol(new Date().getTime()) as unknown as string;

  try {
    parser.preParse(content, ctx, { sessionId });

    const result = await parser.parse(sessionId, ctx);
    const { parsed, messages } = result || {};

    parser.reset({ sessionId });

    return {
      messages,
      content: {
        id: content.id,
        ...parsed,
      } as T,
      ctx,
    };
  } catch (e) {
    ctx.logger?.error('parse failed:', e);
    parser.reset({ sessionId });
    return {
      messages: [] as Messages[],
      content: {} as T,
      ctx,
    };
  }
};

/**
 * only parse structure
 * template,block and page structure merge
 * @param content
 * @param ctx
 * @returns
 */
export const parseStructure = async <T extends ContextPage>(content: T, ctx: Context) => {
  try {
    const mainParser = new MainParser({ content }, ctx);
    const result = await mainParser.parse(ctx);
    const { parsed, messages } = result || {};
    return {
      messages,
      content: {
        id: content.id,
        ...parsed,
      } as T,
      ctx,
    };
  } catch (e) {
    ctx.logger?.error('parse failed:', e);
    return {
      messages: [] as Messages[],
      content: {} as T,
      ctx,
    };
  }
};
