import { Messages } from '@foxpage/foxpage-shared';
import { Condition, ConditionParser, Context, Directive } from '@foxpage/foxpage-types';

import { ConditionParserImpl } from '../condition';
import { executeString } from '../sandbox';

/**
 * directive parser
 *
 * @export
 * @class DirectiveParser
 */
export class DirectiveParser {
  private directives: Directive;
  private conditionParser: ConditionParser;

  constructor(data: Directive) {
    this.directives = data;
    this.conditionParser = new ConditionParserImpl();
  }

  public hasIf() {
    return this.directives.if && this.directives.if.length > 0;
  }

  public hasTpl() {
    return !!this.directives.tpl;
  }

  public parseIf(ctx: Context, messages: Messages) {
    try {
      const result = this.directives.if?.map(item => {
        if (typeof item === 'string') {
          return this.parseItem('if', item || '', ctx, messages);
        }
        // node condition
        const result = this.conditionParser.parseOne({ schemas: [item] } as unknown as Condition, ctx);
        return result.parsed;
      });
      return result?.every(Boolean);
    } catch (e) {
      ctx.logger?.error(`directive.if parse failed`, messages);
      return false;
    }
  }

  public parseTpl(ctx: Context, messages: Messages) {
    return this.parseItem('tpl', this.directives.tpl || '', ctx, messages);
  }

  private parseItem = (target: keyof Directive, expression: string, ctx: Context, messages: Messages) => {
    const _messages = new Messages();
    const result = executeString(expression, ctx.variables, _messages);
    if (result === undefined) {
      ctx.logger?.warn(`directive.${target} "${expression}" parse failed`, _messages);
    } else {
      ctx.logger?.info(`directive.${target} "${expression}" parse succeed`);
    }
    _messages.forEach(item => {
      messages.push(item);
    });
    return result;
  };
}
