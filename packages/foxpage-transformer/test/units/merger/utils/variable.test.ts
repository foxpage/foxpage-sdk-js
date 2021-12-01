import { concatUsedVariablesById, VariableUsed } from '../../../../src';

describe('merger/utils-variable', () => {
  it('concat', () => {
    const conOne: Array<VariableUsed> = [
      { id: '1', name: 'one' },
      { id: '2', name: 'two' },
      { id: '3', name: 'three' },
    ];
    const conTwo: Array<VariableUsed> = [
      { id: '1', name: 'one-1' },
      { id: '2', name: 'two-2' },
      { id: '3', name: 'three' },
    ];

    const result = concatUsedVariablesById(conOne, conTwo);
    expect(result.length).toBe(5);
    expect(result).toContain(conOne[0]);
    expect(result).toContain(conOne[1]);
    expect(result).not.toContain(conOne[2]);
    expect(result).toContain(conTwo[0]);
    expect(result).toContain(conTwo[1]);
    expect(result).toContain(conTwo[2]);
  });
});
