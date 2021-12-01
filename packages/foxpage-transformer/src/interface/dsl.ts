import { ConditionUsed } from './condition';
import { VariableUsed } from './variable';

export type FoxpageComponentProps<T = Record<string, any>> = T & {
  // __listeners?: ComponentListeners;
};

export interface DSLStructure {
  id: string;
  name?: string;

  // 组件
  type: string;
  version: string;
  props?: FoxpageComponentProps;

  // child
  children?: DSLStructure[];

  // var
  variables?: Array<VariableUsed>;

  // condition
  conditions?: Array<ConditionUsed>;
}
