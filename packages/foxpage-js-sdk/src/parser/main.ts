import { parser } from '@foxpage/foxpage-core';
import functionParser from '@foxpage/foxpage-plugin-function-parse';
import { Context, Page } from '@foxpage/foxpage-types';

import { getApis } from '../api';

/**
 * parse
 * @param page page content
 * @param ctx render context
 * @returns parsed page content
 */
export const parse = async (page: Page, ctx: Context) => {
  const parserInstance = parser.getParser();
  if (!parserInstance) {
    await parser.initParser({ hooks: { variable: functionParser({ api: getApis() }).visitor } });
  }

  const parsed = await parser.parse(page, ctx);
  return parsed;
};
