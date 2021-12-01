import { random } from 'faker';

import { evalWithScope } from '../../../src/parser/sandbox/main';

describe('Engine evalWithScope', () => {
  it('Not allow visit out scope variables', () => {
    const words = random.words();
    const val = evalWithScope({ foo: { bar: words } }, 'foo.bar');
    expect(val).toBe(words);
    try {
      evalWithScope({}, 'foo.bar');
    } catch (error) {
      expect(error).toBeInstanceOf(ReferenceError);
    }
  });

  it('Eval use key not in scope, throw error', () => {
    expect.assertions(1);
    const scope = {};
    try {
      evalWithScope(scope, 'logger');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('Allow visit global variable', () => {
    const scope = {};
    const res = evalWithScope(scope, 'Array.isArray([])');
    expect(res).toBeTruthy();
  });

  it('Allow function', () => {
    const resultStr = 'hello eval';
    const fn = `
      function test(){
        return '${resultStr}';
      }
    `;
    const res = evalWithScope({}, fn) as () => void;
    expect(res()).toBe(resultStr);
  });
});
