import { isPlainObject, mapValues } from 'lodash';

import { Messages } from './interface';
import { executeString } from './string';

/**
 * parse object
 *
 * @export
 * @param {*} val
 * @param {Record<string, any>} values
 * @param {string[]} messages
 * @return {*}  {*}
 */
export function executeObject(val: any, values: Record<string, any>, messages: Messages = []): any {
  if (typeof val === 'string') {
    return executeString(val, values, messages);
  } else if (isPlainObject(val)) {
    return mapValues(val, childVar => executeObject(childVar, values, messages));
  } else if (Array.isArray(val)) {
    return val.map(v => executeObject(v, values, messages));
  }
  return val;
}
