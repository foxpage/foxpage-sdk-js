export interface VariableUsed extends Pick<VariableBase, 'id' | 'name'> {}

export interface VariableBase<P = any> {
  id: string;
  name: string;
  type: VariableType | string;
  props: P;
  variables?: Array<{ id: string; name: string }>;
}

export type VariableType = 'data.static' | 'data.proxy' | 'data.sys' | 'data.function' | 'data.function.call';

export type Variable = StaticVariable | ProxyVariable | SysVariable | FunctionVariable | FunctionCallVariable;

export type VariableLike = {
  id?: string;
  name: string;
  type: string;
  props: VariableProps;
  variables?: Array<{ id: string; name: string }>;
};

export type GetVariableByType<T extends VariableType, V = Variable> = V extends { type: T } ? V : never;

export interface VariableCommonProps {
  defaultValue?: any;
  timeout?: number;
}

export type VariableProps<T = any> = T & VariableCommonProps;

interface ProxySoaApi {
  type: 'api.soa2';
  serviceCode: string | number;
  serviceInterface: string;
  useDirectConnection?: boolean;
}

interface ProxyGeneralApi {
  type: 'api.general';
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
}

export interface ProxyVariable extends VariableBase {
  type: 'data.proxy';
  props: VariableProps<{
    type: 'json';
    api: ProxyGeneralApi | ProxySoaApi;
    params: Record<string, any>;
  }>;
}

export interface StaticVariable extends VariableBase {
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

export interface SysVariable extends VariableBase {
  type: 'data.sys';
  props: VariableProps<{
    type: 'json';
    value: {
      name?: string;
    };
  }>;
}

export interface FunctionVariable extends VariableBase {
  type: 'data.function';
  props: VariableProps<{
    type: 'json';
    value: string;
  }>;
}

export interface FunctionCallVariable extends VariableBase {
  type: 'data.function.call';
  props: VariableProps<{
    type: 'json';
    value: {
      method: string;
      args: Record<string, any>;
    };
  }>;
}
