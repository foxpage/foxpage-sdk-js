import { CONTEXT_VARIABLE_MARK } from '@foxpage/foxpage-shared';
import { SysVariable, VariableParseEntity } from '@foxpage/foxpage-types';

import { getSystemVariableValue } from '../provider';
import { VariableType } from '../types';

/**
 * sys variable parse entity
 */
export const sysVariableParseEntity: VariableParseEntity<SysVariable> = {
  type: VariableType.DATA_SYS,
  parse(variable, context) {
    // name: __context:{AA}:bb, AA: sys variable name
    const { name } = variable;
    return getSystemVariableValue(name.replace(CONTEXT_VARIABLE_MARK, ''), context);
  },
};
