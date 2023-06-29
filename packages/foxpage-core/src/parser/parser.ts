import { ContentType } from '@foxpage/foxpage-shared';
import { ConditionParser, Context, ContextPage, Parser, ParserOption, VariableParser } from '@foxpage/foxpage-types';

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
   * first step: preParse content
   * second step: preParse template
   */
  public preParse(content: ContextPage, ctx: Context, opt: { sessionId: string }) {
    this.mainParsers[opt.sessionId] = new MainParser({ content }, ctx);
    this.variableParser?.preParse();
  }

  /**
   * parse
   * first: variable(functions)
   * second: condition
   * last: content
   */
  public async parse(sessionId: string, ctx: Context) {
    if (!this.mainParsers[sessionId]) {
      throw new Error('parser instance is invalid.');
    }

    // variable
    const variableCost = ctx.performanceLogger('variableTime');
    await this.variableParser?.parse(ctx, {});
    variableCost();

    // condition
    const conditionCost = ctx.performanceLogger('conditionTime');
    this.conditionParser?.parse(ctx);
    conditionCost();

    // with variable mock
    if (ctx.isMock) {
      withVariableMock(ctx.getOrigin(ContentType.VARIABLE), ctx);
    }

    // content(page\template\block)
    const structureCost = ctx.performanceLogger('structureTime');
    const result = await this.mainParsers[sessionId]?.parse(ctx);
    structureCost();

    return result;
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
