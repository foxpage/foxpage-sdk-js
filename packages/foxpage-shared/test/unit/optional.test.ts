import { random } from 'faker';

import { optional } from '../../src';

describe('optional', () => {
  it('ok', () => {
    const val = random.words();
    const ok = optional.ok(val);
    expect(ok.ok).toBeTruthy();
    expect(ok.fail).toBeFalsy();
    expect(ok.data).toBe(val);
    expect(ok.error).toBeNull();
    expect(ok.unwrap()).toBe(val);
  });

  it('fail', () => {
    const err = new Error('test');
    const fail = optional.fail(err);

    expect(fail.ok).toBeFalsy();
    expect(fail.fail).toBeTruthy();
    expect(fail.error).toBe(err);
    expect(fail.data).toBeNull();

    expect.assertions(5);

    try {
      fail.unwrap();
    } catch (error) {
      expect(error).toBe(err);
    }
  });
});
