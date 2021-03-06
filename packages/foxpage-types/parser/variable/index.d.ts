import { Context } from "../../context";
import { VariableItem, VariableProps, VariableType } from "../../manager/variable";


export interface SysVariable extends VariableItem {
  type: 'data.sys',
  props: {}
}

export interface StaticVariable extends VariableItem {
  type: 'data.static';
  props: VariableProps<
    | {
      type: 'json';
      value: any;
    }
    | {
      type: string;
      value: any;
    }
  >;
}

export interface FunctionVariable extends VariableItem {
  type: 'data.function.call';
  props: VariableProps<{
    function: string;
    args: any[];
  }>;
}

export interface VariableParseEntity<T = StaticVariable | FunctionVariable | any, R = any> {
  type: VariableType;
  parse: (variable: T, context: Context) => R | void;
}


export interface VariableContext extends Context {
  [key: string]: any;
}

export interface SystemVariableProvider<T = unknown> {
  name: string;
  get: (context: VariableContext) => T | Promise<T>;
}
