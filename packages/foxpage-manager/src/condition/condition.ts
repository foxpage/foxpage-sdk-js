import { Condition, ConditionItem } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from './../common';

/**
 * condition
 *
 * @export
 * @class Condition
 */
export class ConditionInstance extends ContentDetailInstance<ConditionItem> implements Condition {
  constructor(data: Condition) {
    super(data);
  }
}
