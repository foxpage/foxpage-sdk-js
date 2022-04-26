import { ContentType } from '@foxpage/foxpage-shared';
import {
  Context,
  FoxpageHooks,
  Variable,
  VariableItem,
  VariableParseEntity,
  VariableType,
} from '@foxpage/foxpage-types';

import { FunctionParser } from '../function';
import { executeObject } from '../sandbox';

import { staticVariableParseEntity, sysVariableParseEntity } from './type-parsers';

export type VariableParserOption = {
  hooks?: FoxpageHooks;
};

/**
 * variable parser
 *
 * @export
 * @class VariableParser
 */
export class VariableParser {
  /**
   * parser maps
   *
   * @private
   */
  private parserMap = new Map<VariableType, VariableParseEntity>();
  /**
   * function parser
   *
   * @private
   * @type {FunctionParser}
   */
  private functionParser?: FunctionParser;

  constructor() {
    this.functionParser = new FunctionParser();

    // register default variable parser
    this.register(sysVariableParseEntity);
    this.register(staticVariableParseEntity);
  }

  /**
   * get variable parser by variable type
   *
   * @param {VariableType} type
   * @return {*}
   */
  public get(type: VariableType) {
    return this.parserMap.get(type);
  }

  /**
   * register the variable parser
   *
   * @param {VariableParseEntity} parser
   */
  public register(parser: VariableParseEntity) {
    if (!this.get(parser.type)) {
      this.parserMap.set(parser.type, parser);
    }
  }

  /**
   * register dynamic by hooks
   * @param hooks
   */
  public async registerDynamic(hooks: FoxpageHooks = {}) {
    // register parser by plugin dynamic
    const { registerVariableParser } = hooks;
    if (typeof registerVariableParser === 'function') {
      const parsers = (await registerVariableParser()) as unknown as VariableParseEntity[];
      if (parsers) {
        if (Array.isArray(parsers)) {
          parsers.forEach(parser => {
            this.register(parser);
          });
        } else {
          this.register(parsers);
        }
      }
    }
  }

  /**
   * unregister variable parser
   *
   * @param {VariableType} type
   */
  public unRegister(type: VariableType) {
    this.parserMap.delete(type);
  }

  /**
   * parse variable
   *
   * @param {Context} ctx
   * @param {{ parsedVarSet: Set<string>; parsedFnSet: Set<string> }} { parsedVarSet: record parsed variableIds, parsedFnSet: record parsed functionIds }
   * @return {*}
   */
  public async parse(
    ctx: Context,
    { parsedVarSet = new Set(), parsedFnSet = new Set() }: { parsedVarSet?: Set<string>; parsedFnSet?: Set<string> },
  ) {
    const variables = ctx.getOrigin(ContentType.VARIABLE);
    if (variables?.length === 0) {
      return;
    }

    try {
      let nextLoop = false;

      const echo = async (item: Variable) => {
        if (parsedVarSet.has(item.id)) {
          return;
        }

        const existNoParsedFn = this.checkIn(parsedFnSet, item.functions);
        const existNoParsedVar = this.checkIn(parsedVarSet, item.variables);
        if (!existNoParsedFn && !existNoParsedVar) {
          const variable = item.schemas[0];
          const parser = this.createParser(ctx);
          const { parsed, status, messages } = await parser(variable);
          ctx.updateResource(ContentType.VARIABLE, variable.name, {
            content: item,
            parsed,
            parseStatus: status,
            parseMessages: messages,
          });
          parsedVarSet.add(item.id);
        } else {
          if (existNoParsedFn) {
            this.functionParser?.parse(ctx, { parsedVarSet, parsedFnSet });
          }
          nextLoop = true;
        }
      };

      if (variables && variables.length > 0) {
        for (const item of variables) {
          await echo(item);
        }
      }

      if (nextLoop) {
        this.parse(ctx, { parsedVarSet, parsedFnSet });
      }
    } catch (e) {
      ctx.logger?.error((e as Error).message);
    }

    return;
  }

  private checkIn(collects: Set<string>, list?: string[]) {
    return list?.length ? list.findIndex(item => !collects.has(item)) > -1 : false;
  }

  private createParser(ctx: Context) {
    return async (content: VariableItem) => {
      const parser = this.get(content.type);
      const messages: string[] = [];
      if (parser) {
        // parse
        const resolvedProps = executeObject(content.props, ctx.variables, messages) as VariableItem['props'];
        content.props = resolvedProps;

        try {
          const parsed = await parser.parse(content, ctx);
          return { parsed, status: true, messages };
        } catch (e) {
          const msg = `parse variable@${content.name} failed: ${(e as Error).message}`;
          ctx.logger?.error(msg);
          messages.push(msg);
          return { parsed: null, status: false, messages: messages };
        }
      } else {
        const msg = `variable type ${content.type} not supported, should be "${[...this.parserMap.keys()]}"`;
        messages.push(msg);
        ctx.logger?.error(msg);
        return { parsed: content, status: false, messages };
      }
    };
  }
}
