import { StaticVariable, VariableParseEntity } from '@foxpage/foxpage-types';

import { VariableType } from '../types';

function tryJSONParse(value: string) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

/**
 * static variable
 */
export const staticVariableParseEntity: VariableParseEntity<StaticVariable> = {
  type: VariableType.DATA_STATIC,
  parse(variable) {
    const {
      props: { value, type },
    } = variable;

    if (type === 'json') {
      const content = typeof value === 'string' ? tryJSONParse(value) : value;
      return content;
    } else {
      return value;
    }
  },
};
