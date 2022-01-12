import { random } from 'faker';

import { getURLQueryVar } from '../src/main';

describe('variable provider/URLQuery', () => {
  it('URLQuery is object', () => {
    const query = {
      foo: random.words(),
      bar: random.alphaNumeric(),
    };
    const searchQuery = {};
    const url = `https://www.test.com/page?${searchQuery}`;
    const ctx = {
      URL: new URL(url),
    };
    const queryVar = getURLQueryVar(ctx);

    expect(JSON.parse(JSON.stringify(queryVar))).toEqual(query);
    expect('foo' in queryVar).toBeTruthy();
  });

  it('return empty object if no URL', () => {
    const queryVar = getURLQueryVar({} as any);
    expect(queryVar).toEqual({});
  });
});
