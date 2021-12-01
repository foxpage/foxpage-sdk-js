import crypto from 'crypto';
import { readFileSync } from 'fs';
import { createContext, runInContext } from 'vm';

import JSON5 from 'json5';

/**
 * compute MD5
 *
 * @export
 * @param {string} code
 * @param {number} [len=8]
 * @return {*}
 */
export function computeMD5Hash(code: string, len = 8) {
  const md5 = crypto.createHash('md5');
  md5.update(code);
  const hash = md5.digest('hex');
  return hash.substr(0, len);
}

/**
 * run code in node context
 *
 * @export
 * @param {string} code
 * @return {*}
 */
export function runInNodeContext(code: string) {
  const mod: { exports: any } = { exports: {} };
  const context = createContext({ module: mod, exports: mod.exports, require: require, global: global });
  runInContext(code, context);
  return mod;
}

/**
 * load file content
 *
 * @export
 * @template T
 * @param {string} filePath
 * @param {T} [def]
 * @param {*} [{ useJSON5 = false }={}]
 * @return {*}  {T}
 */
export function loadFile<T = any>(filePath: string, def?: T, { useJSON5 = false } = {}): T {
  try {
    if (useJSON5 && filePath.endsWith('.json')) {
      const source = readFileSync(filePath, { encoding: 'utf-8' });
      const result = JSON5.parse(source);
      return result;
    }
    const mod: unknown = require(filePath);
    return mod as T;
  } catch (error) {
    if (def !== undefined) {
      return def;
    }
    // logger.debug('load file %s fail. error: ', filePath, error);
    throw error;
  }
}
