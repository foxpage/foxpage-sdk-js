import { ContentType } from '@foxpage/foxpage-shared';
import {
  Context,
  FoxpageHooks,
  Variable,
  VariableItem,
  VariableParseEntity,
  VariableParser,
  VariableType,
} from '@foxpage/foxpage-types';

import { FunctionParser } from '../function';
import { executeObject } from '../sandbox';

import { staticVariableParseEntity, sysVariableParseEntity } from './type-parsers';

export type VariableParserOption = {
  hooks?: FoxpageHooks;
};

const MAX_LOOP_COUNT = 20;

/**
 * variable parser
 *
 * @export
 * @class VariableParser
 */
export class VariableParserImpl implements VariableParser {
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

  private maxLoopCount: number;

  constructor() {
    this.functionParser = new FunctionParser();

    // register default variable parser
    this.register(sysVariableParseEntity);
    this.register(staticVariableParseEntity);
    this.maxLoopCount = 0;
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
   * pre parse
   */
  public preParse() {
    this.maxLoopCount = 0;
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
          item.name = variable.name;
          const hookCost = ctx.performanceLogger('variablePerformance', item);
          const parser = this.createParser(ctx);
          const { parsed, status, messages } = await parser(variable);
          ctx.updateResource(ContentType.VARIABLE, variable.name, {
            content: item,
            parsed,
            parseStatus: status,
            parseMessages: messages,
          });
          parsedVarSet.add(item.id);
          hookCost();
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
        if (this.maxLoopCount < MAX_LOOP_COUNT) {
          this.maxLoopCount = this.maxLoopCount + 1;
          await this.parse(ctx, { parsedVarSet, parsedFnSet });
        } else {
          throw new Error(
            'the variable loop parse failed: Maybe the variable is wrong or the variable dependency chain is too long',
          );
        }
      }
    } catch (e) {
      ctx.logger?.warn('variable parse failed:', e);
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
          const { variableParseTimeout = 0 } = ctx.appConfigs?.ssr || {};
          const parsed = variableParseTimeout
            ? await timeout(parser.parse(content, ctx), variableParseTimeout)
            : await parser.parse(content, ctx);
          return { parsed, status: true, messages };
        } catch (e) {
          const msg = `parse variable@${content.name} failed: ${(e as Error).message}`;
          ctx.logger?.warn(msg);
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

function timeout(promise: Promise<any>, time: number) {
  return Promise.race([
    promise,
    new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error('variable parse timeout' + `(${time})`));
      }, time);
    }),
  ]);
}
