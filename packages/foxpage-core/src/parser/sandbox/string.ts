import { isObject, isString } from 'lodash';

import { format } from '@foxpage/foxpage-shared';

import { MATCH_EXPRESSION_REGEX } from './constant';
import { Messages } from './interface';
import { evalWithScope } from './main';
import { EXPFormatter } from './utils';

/**
 * parse string
 *
 * @export
 * @template T
 * @param {string} str
 * @param {Record<string, any>} [values={}]
 * @param {Messages} [messages=[]]
 * @return {*}  {(string | T | undefined)}
 */
export function executeString<T = unknown>(
  expression: string,
  values: Record<string, any> = {},
  messages: Messages = [],
): string | T | undefined {
  const str = expression;

  const checkValue = (val: unknown) => {
    // undefined 视为一个非法的值
    if (val === undefined) {
      throw new Error('value is undefined');
    }
  };

  const error = (message: string, ...args: any[]) => {
    const msg = format(message, ...args);
    messages.hasError = true;
    messages.push(msg);
  };

  messages.hasError = false;
  if (/^\{\{([\s\S]*)\}\}$/.test(str) && !str.substr(0, str.length - 2).includes('}}')) {
    try {
      const expression = str.substring(2, str.length - 2);
      const val = evalWithScope(values, EXPFormatter(expression));
      checkValue(val);
      return val as T;
    } catch (err) {
      error('parse string "%s" fail, reason: %s', str, (err as Error).message);
      return undefined;
    }
  }
  const regex = MATCH_EXPRESSION_REGEX;
  const result = str.replace(regex, (match, expression) => {
    try {
      const val = evalWithScope(values, EXPFormatter(expression));
      checkValue(val);
      return stringify(val);
    } catch (err) {
      error('parse string "%s" in "%s" fail, reason: %s', match, str, (err as Error).message);
      return '';
    }
  });
  return result;
}

function stringify(val: unknown): string {
  if (isString(val)) {
    return val;
  } else if (isObject(val)) {
    try {
      return JSON.stringify(val);
    } catch (error) {}
  }
  return String(val);
}
