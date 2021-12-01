import { ContentDetail } from '../../content';
import { ManagerBase } from '../../manager';

export type VariableType = 'data.sys' | 'data.static' | 'data.proxy' | 'data.function' | 'data.function.call' | string;

export type VariableProps<T = {}> = T;

export interface VariableItem<P = any> {
  /**
   * variable name
   *
   * @type {string}
   */
  name: string;
  /**
   * variable type
   *
   * @type {VariableType}
   */
  type: VariableType | string;
  /**
   * variable props
   */
  props: P;
}

export interface Variable extends ContentDetail<VariableItem> { };

export interface VariableManager<T = Variable> extends ManagerBase<T> {
  addVariable(variable: Variable): void;
  removeVariables(variableIds: string[]): void;
  getVariable(variableId: string): Promise<Variable | undefined>;
  getVariables(variableIds: string[]): Promise<Variable[]>;
  freshVariables(variableIds: string[]): Promise<Variable[]>;
}
