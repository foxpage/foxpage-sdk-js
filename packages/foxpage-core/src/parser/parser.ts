import { Messages } from '@foxpage/foxpage-shared';
import { Context, Page, PageParser, Parser, ParserOption, TemplateParser } from '@foxpage/foxpage-types';

import { ConditionParser } from './condition';
import { PageParserImpl } from './page';
import { TemplateParserImpl } from './template';
import { VariableParser } from './variable';

/**
 * parser implements
 *
 * @export
 * @class ParserImpl
 * @implements {Parser}
 */
export class ParserImpl implements Parser {
  /**
   * render context
   *
   * @type {Context}
   */
  ctx?: Context;
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
   * variable parser
   *
   * @type {VariableParser}
   */
  variableParser?: VariableParser;
  /**
   * condition parser
   *
   * @type {ConditionParser}
   */
  conditionParser?: ConditionParser;

  messages: Messages;

  constructor() {
    this.variableParser = new VariableParser();
    this.conditionParser = new ConditionParser();
    this.messages = new Messages();
  }

  /**
   * prepare
   * @param opt parserOption
   */
  public async prepare(opt?: ParserOption) {
    const { hooks } = opt || {};
    await this.variableParser?.registerDynamic(hooks?.variable);
  }

  /**
   * pre parse
   * first step: preParse page
   * second step: preParse template
   */
  public preParse(page: Page, ctx: Context) {
    this.ctx = ctx;
    this.templateParser = new TemplateParserImpl();
    this.pageParser = new PageParserImpl(page);
    this.pageParser?.preParse(this.ctx);
    this.templateParser?.preParse(this.ctx, {
      containerGetter: templateId => this.pageParser?.getTemplateSchemas(templateId),
    });
  }

  /**
   * parse
   * first: variable(functions)
   * second: condition
   * last: page
   */
  public parse() {
    if (!this.ctx) {
      throw new Error('render context is invalid.');
    }
    if (!this.pageParser) {
      throw new Error('page parser instance is invalid.');
    }
    this.ctx.logger?.debug('start parse');

    this.variableParser?.parse(this.ctx, {});
    this.conditionParser?.parse(this.ctx);
    this.templateParser?.parse(this.ctx);

    const parsedPageSchemas = this.pageParser.parse(this.ctx);
    if (this.pageParser.messages.hasError) {
      this.messages.push(this.pageParser.messages.toString());
      return;
    }

    this.ctx.updatePage({
      id: this.pageParser.page.id,
      schemas: parsedPageSchemas,
      relation: this.pageParser.page.relation,
    });
    this.ctx.logger?.info(`page@${this.ctx.page.id} parsed success.`);
    return this.ctx.page.schemas;
  }

  /**
   * get parse status
   *
   * @return {*}  {boolean} true:parsed,false:no parse
   */
  public isParsed(): boolean {
    return false;
  }

  /**
   * clear instance
   *
   */
  public reset() {
    this.ctx = undefined;
    this.pageParser = undefined;
    this.templateParser = undefined;
    this.messages = new Messages();
  }
}
