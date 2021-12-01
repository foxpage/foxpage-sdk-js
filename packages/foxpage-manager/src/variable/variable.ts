import { Variable, VariableItem } from '@foxpage/foxpage-types';

import { ContentDetailInstance } from '../common';

/**
 * variable
 *
 * @export
 * @class Variable
 */
export class VariableInstance extends ContentDetailInstance<VariableItem> implements Variable {
  constructor(data: Variable) {
    super(data);
  }
}
