import { unionWith } from 'lodash';

import { Condition } from '../interface';

export const conditionsMerge = (statics?: Condition[], dynamics?: Condition[]) => {
  if (!statics) {
    return dynamics || [];
  }

  if (!dynamics) {
    return statics;
  }

  return unionWith(dynamics, statics, (a: Condition, b: Condition) => a.id === b.id);
};
