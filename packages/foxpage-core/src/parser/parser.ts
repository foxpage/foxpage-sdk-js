import { ContentType } from '@foxpage/foxpage-shared';
import { ConditionParser, Context, Page, Parser, ParserOption, VariableParser } from '@foxpage/foxpage-types';

import { withVariableMock } from '../mocker';

import { ConditionParserImpl } from './condition';
import { MainParser } from './main';
import { VariableParserImpl } from './variable';

/**
 * parser implements
 *
 * @export
 * @class ParserImpl
 * @implements {Parser}
 */
export class ParserImpl implements Parser {
  /**
   * variable parser
   *
   * @type {VariableParserImpl}
   */
  variableParser?: VariableParser;
  /**
   * condition parser
   *
   * @type {ConditionParserImpl}
   */
  conditionParser?: ConditionParser;

  mainParsers: Record<string, MainParser> = {};

  constructor() {
    this.variableParser = new VariableParserImpl();
    this.conditionParser = new ConditionParserImpl();
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
  public preParse(page: Page, ctx: Context, opt: { sessionId: string }) {
    this.mainParsers[opt.sessionId] = new MainParser({ page }, ctx);
    this.variableParser?.preParse();
  }

  /**
   * parse
   * first: variable(functions)
   * second: condition
   * last: page
   */
  public async parse(sessionId: string, ctx: Context) {
    if (!this.mainParsers[sessionId]) {
      throw new Error('parser instance is invalid.');
    }

    await this.variableParser?.parse(ctx, {});
    this.conditionParser?.parse(ctx);

    // with variable mock
    if (ctx.isMock) {
      withVariableMock(ctx.getOrigin(ContentType.VARIABLE), ctx);
    }

    return this.mainParsers[sessionId]?.parse(ctx);
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
  public reset(opt: { sessionId: string }) {
    delete this.mainParsers[opt.sessionId];
  }
}
