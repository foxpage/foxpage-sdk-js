import { combineProps, replaceProps } from '../../../src';

describe('merger/props', () => {
  it('props replace', () => {
    const merged = {
      textOne: 'test 1',
      promoId: '{{page.promoID}}',
      starHalf: true,
    };
    const matched = {
      textOne: 'test 2',
      showStatus: true,
      promoId: '234',
      starHalf: false,
    };
    const result = replaceProps(merged, matched);
    expect(result.promoId).toBe('234');
    expect(result.textOne).toBe('test 2');
    expect(result.starHalf).toBeFalsy();
  });

  it('matched props is empty', () => {
    const merged = {
      textOne: 'test 1',
      promoId: '234',
      starHalf: true,
      child: { id: 1, text: 'one', desc: 'combine' },
    };
    const result = replaceProps(merged);
    expect(result).toEqual(merged);
  });

  it('props combine', () => {
    const merged = {
      textOne: 'test 1',
      promoId: '234',
      starHalf: true,
    };
    const matched = {
      starHalf: false,
    };
    const result = combineProps(merged, matched);
    expect(result.promoId).toBe('234');
    expect(result.starHalf).toBeFalsy();
    expect(result.textOne).toBe('test 1');
  });

  it('props combine contains array', () => {
    const merged = {
      textOne: 'test 1',
      promoId: '234',
      starHalf: true,
      items: [{ id: 1, text: 'one' }],
    };
    const matched = {
      starHalf: false,
      items: [{ id: 2, text: 'two' }],
    };
    const result = combineProps(merged, matched);
    expect(result.items.length).toBe(1);
    expect(result.items).toContainEqual({ id: 2, text: 'two' });
  });

  it('props combine contains object', () => {
    const merged = {
      textOne: 'test 1',
      promoId: '234',
      starHalf: true,
      child: { id: 1, text: 'one', desc: 'combine' },
    };
    const matched = {
      starHalf: false,
      child: { id: 2, text: 'two' },
    };
    const result = combineProps(merged, matched);
    expect(result.child).toEqual({ id: 2, text: 'two', desc: 'combine' });
  });
});
