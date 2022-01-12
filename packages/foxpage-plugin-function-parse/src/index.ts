import { FoxpagePlugin } from '@foxpage/foxpage-plugin';
import {
  FoxpageHooks,
  FoxpagePluginApi,
  VariableItem,
  VariableParseEntity,
  VariableProps,
} from '@foxpage/foxpage-types';

export interface FunctionVariable extends VariableItem {
  type: 'data.function.call';
  props: VariableProps<{
    function: string;
    args: any[];
  }>;
}

/**
 * register function parser plugin
 * @returns function parser
 */
const functionParser = ({ api }: { api: FoxpagePluginApi }): FoxpagePlugin<FoxpageHooks> => {
  return {
    visitor: {
      registerVariableParser: () => {
        return {
          type: 'data.function.call',
          parse(variable, context) {
            const {
              props: { function: code, args = [] },
            } = variable;

            if (code) {
              const fn: unknown = api?.evalWithScope
                ? api.evalWithScope<(scope: unknown) => unknown>({ $this: context }, code)
                : '';
              if (typeof fn === 'function') {
                const result = fn.call(context, ...args);
                return result;
              }
            }

            throw new Error(`${variable.name} function is correct`);
          },
        } as VariableParseEntity<FunctionVariable>;
      },
    },
  };
};

export default functionParser;
