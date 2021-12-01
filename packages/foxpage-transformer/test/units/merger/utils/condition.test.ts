import { concatUsedConditionsById, ConditionUsed } from '../../../../src';

describe('merge/utils-condition', () => {
  it('concat', () => {
    const conOne: Array<ConditionUsed> = [
      { id: '1', name: 'one' },
      { id: '3', name: 'three' },
    ];
    const conTwo: Array<ConditionUsed> = [
      { id: '2', name: 'two' },
      { id: '3', name: 'three' },
    ];

    const result = concatUsedConditionsById(conOne, conTwo);
    expect(result.length).toBe(3);
    expect(result).toContain(conOne[0]);
    expect(result).not.toContain(conOne[1]);
    expect(result).toContain(conTwo[0]);
    expect(result).toContain(conTwo[1]);
  });
});
