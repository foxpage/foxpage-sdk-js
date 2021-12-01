import { unionWith } from 'lodash';

import { VariableBase } from '../interface';

export const variablesMerge = (statics?: VariableBase<any>[], dynamics?: VariableBase[]) => {
  if (!statics) {
    return dynamics || [];
  }

  if (!dynamics) {
    return statics;
  }

  return unionWith(dynamics, statics, (a: VariableBase, b: VariableBase) => a.id === b.id);
};
