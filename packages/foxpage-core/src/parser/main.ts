import { Messages } from '@foxpage/foxpage-shared';
import { Block, BlockParser, Context, ContextPage, Page, PageParser, TemplateParser } from '@foxpage/foxpage-types';

import { BlockParserImpl } from './block';
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
   * block parser
   *
   * @type {BlockParser}
   */
  blockParser?: BlockParser;
  /**
   * parse main content
   */
  private mainContent;
  /**
   * messages
   */
  messages?: Messages = new Messages();

  constructor({ content }: { content: ContextPage }, ctx: Context) {
    this.mainContent = content;
    if (this.isPage()) {
      this.templateParser = new TemplateParserImpl();
      this.blockParser = new BlockParserImpl();
      this.pageParser = new PageParserImpl(content as Page);
      this.prepare(ctx);
    } else if (this.isBlock()) {
      this.blockParser = new BlockParserImpl();
    }
  }

  prepare(ctx: Context) {
    if (this.isPage()) {
      this.pageParser?.preParse(ctx);
      this.templateParser?.preParse(ctx, {
        containerGetter: templateId => this.pageParser?.getTemplateSchemas(templateId),
      });
      this.blockParser?.preParse(ctx, {
        containerGetter: blockId => this.pageParser?.getBlockSchemas(blockId),
      });
    }
  }

  async parse(ctx: Context) {
    let result: { parsed: ContextPage; messages: string[] } | undefined;
    if (this.isPage()) {
      this.templateParser?.parse(ctx);
      this.blockParser?.parse(ctx);
      result = this.pageParser?.parse(ctx);
    }

    if (this.isBlock()) {
      result = this.blockParser?.parseOne(this.mainContent as Block, ctx);
    }

    if (result) {
      ctx.updatePage(result.parsed);
    }
    // clear memory
    this.reset();
    return result;
  }

  private isPage() {
    return this.mainContent.type === 'page';
  }

  private isBlock() {
    return this.mainContent.type === 'block';
  }

  reset() {
    this.pageParser = undefined;
    this.templateParser = undefined;
    this.blockParser = undefined;
    this.messages = undefined;
  }
}
