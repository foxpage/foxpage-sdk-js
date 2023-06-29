import { isObject, isString } from 'lodash';

import { format } from '@foxpage/foxpage-shared';

import { MATCH_EXPRESSION_REGEX } from './constant';
import { Messages } from './interface';
import { evalWithScope } from './main';

/**
 * parse string
 *
 * @export
 * @template T
 * @param {string} str
 * @param {Record<string, any>} [scopes={}]
 * @param {Messages} [messages=[]]
 * @return {*}  {(string | T | undefined)}
 */
export function executeString<T = unknown>(
  expression: string,
  scopes: Record<string, any> = {},
  messages: Messages = [],
): string | T | undefined {
  const str = expression;

  const error = (message: string, ...args: any[]) => {
    const msg = format(message, ...args);
    messages.hasError = true;
    messages.push(msg);
  };

  messages.hasError = false;
  if (/^\{\{([\s\S]*)\}\}$/.test(str) && !str.substr(0, str.length - 2).includes('}}')) {
    try {
      const expression = str.substring(2, str.length - 2);
      const val = evalWithScope(scopes, expression);
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
      const val = evalWithScope(scopes, expression);
      checkValue(val);
      return stringify(val);
    } catch (err) {
      error('parse string "%s" in "%s" fail, reason: %s', match, str, (err as Error).message);
      return '';
    }
  });
  return result;
}

/**
 * get str expression & parsed result map
 * @param str
 * @param scopes
 * @param messages
 */
export function getVars(str: string, scopes: Record<string, any> = {}, messages: Messages = []) {
  const error = (message: string, ...args: any[]) => {
    const msg = format(message, ...args);
    messages.hasError = true;
    messages.push(msg);
  };

  const vars: { key: string; value?: any }[] = [];
  const regex = MATCH_EXPRESSION_REGEX;
  str.match(regex)?.forEach(item => {
    const expression = item.substring(2, item.length - 2);
    try {
      const value = evalWithScope(scopes, expression);
      checkValue(value);
      vars.push({
        key: item,
        value,
      });
    } catch (err) {
      error('parse string "%s" in "%s" fail, reason: %s', item, str, (err as Error).message);
      vars.push({
        key: item,
        // value: '',
      });
    }
  });
  return vars;
}

function checkValue(val: unknown) {
  // undefined is invalid data
  if (val === undefined) {
    throw new Error('value is undefined');
  }
}

function stringify(val: unknown): string {
  if (isString(val)) {
    return val;
  } else if (isObject(val)) {
    try {
      return JSON.stringify(val);
    } catch (error) {
      return '';
    }
  }
  return String(val);
}
