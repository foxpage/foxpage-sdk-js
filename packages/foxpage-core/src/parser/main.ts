import { Messages } from '@foxpage/foxpage-shared';
import { Context, Page, PageParser, TemplateParser } from '@foxpage/foxpage-types';

import { PageParserImpl } from './page';
import { TemplateParserImpl } from './template';

export class MainParser {
  /**
   * page parser
   *
   * @type {PageParser}
   */
  pageParser?: PageParser;
  /**
   * template parser
   *
   * @type {TemplateParser}
   */
  templateParser?: TemplateParser;
  /**
   * messages
   */
  messages?: Messages = new Messages();

  constructor({ page }: { page: Page }, ctx: Context) {
    this.templateParser = new TemplateParserImpl();
    this.pageParser = new PageParserImpl(page);
    this.prepare(ctx);
  }

  prepare(ctx: Context) {
    this.pageParser?.preParse(ctx);
    this.templateParser?.preParse(ctx, {
      containerGetter: templateId => this.pageParser?.getTemplateSchemas(templateId),
    });
  }

  async parse(ctx: Context) {
    if (!this.pageParser) {
      throw new Error('page parser instance is invalid.');
    }
    ctx.logger?.info('start parse page & template');
    this.templateParser?.parse(ctx);

    const parsedPageSchemas = this.pageParser.parse(ctx);
    if (this.pageParser.messages.hasError) {
      this.messages?.push(this.pageParser.messages.toString());
      return;
    }

    ctx.updatePage({
      id: this.pageParser.page.id,
      schemas: parsedPageSchemas,
      relation: this.pageParser.page.relation,
    });
    ctx.logger?.info(`page@${ctx.page.id} parsed success.`);
    const result = ctx.page.schemas;

    // clear
    this.reset();

    return { parsed: result, messages: this.messages };
  }

  reset() {
    this.pageParser = undefined;
    this.templateParser = undefined;
    this.messages = undefined;
  }
}
