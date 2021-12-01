import { ExpressionOperation } from '@foxpage/foxpage-types';

import { ConditionType } from './types';

export const supportConditionTypes: Array<number | string> = Object.values(ConditionType);

export const supportOperations: ExpressionOperation[] = [
  'lt',
  'lt_eq',
  'gt',
  'gt_eq',
  'eq',
  'ct',
  'in_array',
  'sw',
  'ew',
  'regex',
  'regex_uncase',
  'un_eq',
  'un_ct',
  'un_in_array',
  'un_sw',
  'un_ew',
  'un_regex',
  'un_regex_uncase',
];
