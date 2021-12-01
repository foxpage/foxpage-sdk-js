/**
 * eval with scope
 *
 * @export
 * @template T
 * @param {Record<string, any>} scope
 * @param {string} expression
 * @return {*}  {T}
 */
export function evalWithScope<T = unknown>(scope: Record<string, any>, expression: string): T {
  const __scope__ = new Proxy(scope, {
    get(target, key, receiver) {
      if (typeof key !== 'symbol') {
        if (key in target) {
          return target[key];
        }
        if (key in global) {
          return (global as any)[key];
        }
        throw new ReferenceError(`"${key}" is undefined.`);
      }
      return Reflect.get(target, key, receiver);
    },
    // expression 只能访问 scope 里面的变量
    has(_target, p) {
      if (p === '__tmp__') {
        return false;
      }
      return true;
    },
  });
  __scope__;
  // eslint-disable-next-line prefer-const
  let __tmp__: T = undefined as any;
  try {
    eval(`
    with(__scope__) {
      __tmp__ = ${expression}
    }
  `);
  } catch (error) {
    (error as Error).message = `eval "${expression}" fail, reason: ${(error as Error).message}`;
    throw error;
  }
  return __tmp__;
}
