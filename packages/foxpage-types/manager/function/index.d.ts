import { ContentDetail } from '../../content';
import { ManagerBase } from '../../manager';

export declare type FPFunctionType = 'javascript.function';

/**
 * function props
 *
 * @export
 * @interface FPFunctionItemProps
 */
export interface FPFunctionItemProps {
  /**
   * async or sync
   *
   * @type {boolean}
   */
  async: boolean;
  /**
   * function code
   *
   * @type {string}
   */
  code: string;
}

/**
 * function item
 *
 * @export
 * @interface FPFunctionItem
 */
export interface FPFunctionItem {
  /**
   * function item name
   *
   * @type {string}
   */
  name: string;
  /**
   * function item type
   *
   * @type {FPFunctionType}
   */
  type: FPFunctionType;
  /**
   * function item props
   *
   * @type {FPFunctionItemProps}
   */
  props: FPFunctionItemProps;
}


export interface FPFunction extends ContentDetail<FPFunctionItem> {
  getFunctionItem?(functionName: string): FPFunctionItem | null;
  destroy?(): void;
}

export interface FunctionManager<T = FPFunction> extends ManagerBase<T> {
  addFunction(content: FPFunction): void;
  removeFunctions(functionIds: string[]): void;
  getFunction(functionId: string): Promise<FPFunction | null>
  getFunctionItem(functionId: string, functionItemName: string): Promise<FPFunctionItem | null>;
  getFunctions(functionIds: string[]): Promise<FPFunction[]>;
  freshFunctions(functionIds: string[]): Promise<FPFunction[]>;
}
