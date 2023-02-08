import { VariableUsed } from '../../interface';

export function concatUsedVariablesById(oldList: Array<VariableUsed> = [], newList: Array<VariableUsed> = []) {
  const result = newList.slice();
  oldList.forEach(item => {
    const idx = result.findIndex(it => it.id === item.id && it.name === item.name);
    if (idx === -1) {
      result.push(item);
    }
  });
  return result;
}
