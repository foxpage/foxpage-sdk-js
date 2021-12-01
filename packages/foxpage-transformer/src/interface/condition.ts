export type ConditionEmptyType = 0;
export type ConditionAndType = 1;
export type ConditionOrType = 2;

export type ConditionType = ConditionEmptyType | ConditionAndType | ConditionOrType;

export interface ConditionExpression {
  id?: string | number;
  key: string;
  operation: ExpressionOperation;
  value: string | any[] | RegExp;
}

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

export interface Condition {
  id: string;
  name: string;
  type: ConditionType;

  expressions?: ConditionExpression[];

  props?: {
    items?: ConditionExpression[];
  };

  variables?: { id: string; name: string };
}

export interface ConditionUsed extends Pick<Condition, 'id' | 'name'> {}
