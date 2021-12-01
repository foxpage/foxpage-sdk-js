import { ContentDetail } from '../../content';
import { ManagerBase } from '../../manager';

export type ConditionType = 0 | 1 | 2;
export type ConditionExpressionType = 'condition.expression';
export type ExpressionOperation =
  | 'lt'
  | 'lt_eq'
  | 'gt'
  | 'gt_eq'
  | 'eq'
  | 'ct'
  | 'in_array'
  | 'sw'
  | 'ew'
  | 'regex'
  | 'regex_uncase'
  | 'un_eq'
  | 'un_ct'
  | 'un_in_array'
  | 'un_sw'
  | 'un_ew'
  | 'un_regex'
  | 'un_regex_uncase';

/**
 * condition expression props
 *
 * @export
 * @interface ConditionExpressionProps
 */
export interface ConditionExpressionProps {
  /**
   * condition id
   *
   * @type {string}
   */
  readonly id: string;

  /**
   * condition key
   * The value on the left-hand side of the expression
   * @type {string}
   */
  key: string;

  /**
   * expression operation
   *
   * @type {ExpressionOperation}
   */
  operation: ExpressionOperation;

  /**
   * condition value
   * The value on the right-hand side of the expression
   * @type {string}
   */
  value: string;
}

/**
 * condition expression
 *
 * @export
 * @interface ConditionExpression
 */
export interface ConditionExpression {
  /**
   * condition expression type
   *
   * @type {ConditionExpressionType}
   */
  type: ConditionExpressionType;
  /**
   * condition expression props
   *
   * @type {ConditionExpressionProps}
   */
  props: ConditionExpressionProps;
}


/**
 * condition props
 * @interface
 */
export interface ConditionProps { }

/**
 * condition item
 *
 * @export
 * @interface ConditionItem
 */
export interface ConditionItem {
  /**
   * condition name
   *
   * @type {string}
   */
  name: string;
  /**
   * condition type
   *
   * @type {ConditionType}
   */
  type: ConditionType;
  /**
   * condition props
   *
   * @type {ConditionProps}
   */
  props: ConditionProps;
  /**
   * condition children
   *
   * @type {ConditionExpression}
   */
  children: ConditionExpression[];
}

export interface Condition extends ContentDetail<ConditionItem> {
}

export interface ConditionManager<T = Condition> extends ManagerBase<T> {
  addCondition(condition: Condition): void;
  removeConditions(conditionIds: string[]): void;
  getCondition(conditionId: string): Promise<Condition | undefined>;
  getConditions(conditionIds: string[]): Promise<Condition[]>;
  freshConditions(conditionIds: string[]): Promise<Condition[]>;
}
