const COLON = ':';
const DOT = '.';
const BRACKET_START = '[';
const BRACKET_END = ']';
/**
 *
 * {{AA:BB:CC}} => AA -> BB -> CC
 * {{AA['BB:CC']['DD']}} => AA -> 'BB:CC' -> 'DD'
 * @param expressionStr
 * @returns
 */
export function getPath(expressionStr: string) {
  const doit = (expression: string) => {
    const positions = [] as { pos: number; mark: string }[];

    function searchSubStr(str: string, subStr: string) {
      let pos = str.indexOf(subStr);
      while (pos > -1) {
        positions.push({ pos, mark: subStr });
        pos = str.indexOf(subStr, pos + 1);
      }
    }

    searchSubStr(expression, COLON);
    searchSubStr(expression, DOT);
    searchSubStr(expression, BRACKET_START);
    searchSubStr(expression, BRACKET_END);

    if (positions.length > 0) {
      const list = positions.sort((a, b) => a.pos - b.pos);
      const path = [] as (string | string[])[];
      let preIdx = 0;
      list.forEach((item, idx) => {
        const { mark, pos } = item;
        if (preIdx <= pos) {
          if (preIdx !== pos) {
            path.push(expression.substring(preIdx, pos));
          }
          if (mark === COLON) {
            preIdx = pos + 1;
          } else if (mark === DOT) {
            preIdx = pos + 1;
          } else if (mark === BRACKET_START) {
            const nextCloseTagIdx = list.findIndex(it => it.pos > pos && it.mark === BRACKET_END);
            const nextCloseTag = list[nextCloseTagIdx];
            if (nextCloseTag) {
              const value = expression.substring(pos + 1, nextCloseTag.pos);
              if (value.includes("'") || value.includes('"')) {
                path.push(value.substring(0, value.length - 1).substring(1));
              } else {
                path.push(doit(value) as string[]);
              }
              preIdx = nextCloseTag.pos + 1;
            } else {
              path.push(expression.substring(preIdx, expression.length));
              preIdx = expression.length + 1;
            }
          }
        }
        if (idx === list.length - 1 && pos < expression.length - 1) {
          path.push(expression.substring(pos + 1, expression.length));
        }
      });
      return path;
    }

    return [expression];
  };

  return doit(expressionStr);
}

/**
 * get value with scope
 *
 * @export
 * @template T
 * @param {Record<string, any>} scope
 * @param {string} expression
 * @return {*}  {T}
 */
export function getValue<T = unknown>(scope: Record<string, any>, expression: string): T {
  const __scope__ = new Proxy(scope, {
    get(target, key, receiver) {
      if (typeof key !== 'symbol') {
        if (key in target) {
          return target[key];
        }
        throw new ReferenceError(`"${key}" is undefined.`);
      }
      return Reflect.get(target, key, receiver);
    },
  });

  let result: T = undefined as any;
  try {
    const getResult = (_keypath: (string | string[])[]) => {
      let _result: T = undefined as any;
      // @ts-ignore
      _result = _keypath.reduce((a, c) => {
        if (typeof c === 'string') {
          if (typeof a[c] !== 'undefined') return a[c];
          // eslint-disable-next-line no-prototype-builtins
          if (!a.hasOwnProperty(c)) {
            throw new Error(`the key ${c} not exist`);
          }
        } else {
          const __result = getResult(c);
          if (typeof __result === 'string') {
            return a[__result];
          } else {
            throw new Error(`the key ${String(c)} get value failed`);
          }
        }
      }, __scope__);

      return _result;
    };

    const keyPath = getPath(expression);
    result = getResult(keyPath);
  } catch (error) {
    (error as Error).message = `eval "${expression}" fail, reason: ${(error as Error).message}`;
    throw error;
  }
  return result;
}

export const evalWithScope = getValue;
