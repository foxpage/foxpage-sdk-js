import { isPlainObject } from 'lodash';

type JsonFriendlyObject<T extends { [key: string]: any }> = {
  [P in keyof T]: JsonFriendlyType<T[P]>;
};

type JsonFriendlyType<T> = T extends Map<string | number, infer P>
  ? Record<string, P>
  : T extends Set<infer P>
  ? Array<P>
  : T extends (...args: any) => any | Promise<any>
  ? string
  : T extends { [key: string]: any }
  ? JsonFriendlyObject<T>
  : T;

export function toJSONFriendly<T>(value: T): JsonFriendlyType<T> {
  let friendlyValue: any;

  if (value instanceof Map) {
    friendlyValue = {};
    for (const it of value.entries()) {
      friendlyValue[String(it[0])] = toJSONFriendly(it[1]);
    }
    return friendlyValue;
  }

  if (value instanceof Set) {
    friendlyValue = [];
    for (const it of value.values()) {
      friendlyValue.push(toJSONFriendly(it));
    }
    return friendlyValue;
  }

  if (typeof value === 'function') {
    return value.toString() as JsonFriendlyType<T>;
  }

  // loop nested object
  if (typeof value === 'object' && value !== null && isPlainObject(value)) {
    friendlyValue = {};
    for (const it of Object.entries(value)) {
      friendlyValue[it[0]] = toJSONFriendly(it[1]);
    }
    return friendlyValue;
  }

  return value as JsonFriendlyType<T>;
}

function stringifyReplacer(_key: string, value: unknown): any {
  let returnValue: any = value;

  if (value instanceof Map) {
    returnValue = {};
    for (const it of value.entries()) {
      returnValue[it[0]] = it[1];
    }
    return returnValue;
  }

  if (value instanceof Set) {
    returnValue = [];
    for (const it of value.values()) {
      returnValue.push(it);
    }
    return returnValue;
  }

  if (typeof value === 'function') {
    return value.toString();
  }

  return returnValue;
}

export function betterJSONStringify(obj: any) {
  try {
    return JSON.stringify(obj, stringifyReplacer);
  } catch (error) {
    return '';
  }
}
