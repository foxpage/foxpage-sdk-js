import { ContentType } from '@foxpage/foxpage-shared';
import { Context, FPFunctionItemProps } from '@foxpage/foxpage-types';

import { executeObject } from '../sandbox';

export class FunctionParser {
  /**
   * parse function
   *
   * @param {Context} ctx
   * @param {{ parsedVarSet: Set<string>; parsedFnSet: Set<string> }} { parsedVarSet: record parsed variableIds, parsedFnSet: record parsed functionIds }
   * @return {*}
   */
  public parse(
    ctx: Context,
    { parsedVarSet = new Set(), parsedFnSet = new Set() }: { parsedVarSet?: Set<string>; parsedFnSet?: Set<string> },
  ) {
    const fns = ctx.getOrigin(ContentType.FUNCTION);
    if (fns?.length === 0) {
      return;
    }

    fns?.forEach(item => {
      if (parsedVarSet.has(item.id)) {
        return;
      }

      const existNoParsedVar = this.checkIn(parsedVarSet, item.variables);
      if (!existNoParsedVar) {
        const content = item.schemas[0];
        const messages: string[] = [];
        try {
          const resolvedProps: FPFunctionItemProps = executeObject(content.props, ctx.variables, messages);
          ctx.updateResource(ContentType.FUNCTION, item.id, {
            content: item,
            parsed: { [content.name]: resolvedProps.code },
            parseStatus: true,
            parseMessages: messages,
          });
        } catch (e) {
          messages.push(`parse function@${item.id} failed:`, JSON.stringify(e));
        }
        parsedFnSet.add(item.id);
      }
    });
  }

  private checkIn(collects: Set<string>, list?: string[]) {
    return list?.length ? list.findIndex(item => !collects.has(item)) > -1 : false;
  }
}
